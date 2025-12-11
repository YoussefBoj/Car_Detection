from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import base64
import cv2
import numpy as np
import torch
import tensorflow as tf
from PIL import Image
import io
import time
import os
from typing import List, Dict, Any
from roboflow import Roboflow
from transformers import AutoImageProcessor, AutoModelForImageClassification, pipeline
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI AutoExpert Detection Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variables
yolo_model = None
gnet_model = None
damage_severity_model = None
roboflow_model = None
car_brand_pipeline = None
damage_type_pipeline = None

def load_gnet_model():
    """Load GNet model for AI-or-not detection"""
    global gnet_model
    try:
        model_path = "models/gnet.h5"
        if os.path.exists(model_path):
            gnet_model = tf.keras.models.load_model(model_path)
            logger.info("✅ GNet AI detection model loaded successfully")
        else:
            logger.warning(f"❌ GNet model not found at {model_path}")
    except Exception as e:
        logger.error(f"❌ Error loading GNet model: {e}")

def load_yolo_model():
    """Load YOLO model for object detection"""
    global yolo_model
    try:
        model_path = "models/best.pt"
        if os.path.exists(model_path):
            yolo_model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path)
            logger.info("✅ YOLO model loaded successfully")
        else:
            logger.warning(f"❌ YOLO model not found at {model_path}")
    except Exception as e:
        logger.error(f"❌ Error loading YOLO model: {e}")

def load_damage_severity_model():
    """Load car damage severity model"""
    global damage_severity_model
    try:
        model_path = "models/car-damage-model.h5"
        if os.path.exists(model_path):
            damage_severity_model = tf.keras.models.load_model(model_path)
            logger.info("✅ Car damage severity model loaded successfully")
        else:
            logger.warning(f"❌ Damage severity model not found at {model_path}")
    except Exception as e:
        logger.error(f"❌ Error loading damage severity model: {e}")

def load_roboflow_model():
    """Load Roboflow model for car damage detection"""
    global roboflow_model
    try:
        api_key = os.getenv("ROBOFLOW_API_KEY", "EJdF3gB2PwrQDNlVhauC")
        rf = Roboflow(api_key=api_key)
        project = rf.workspace().project("car-damage-coco-v9i")
        roboflow_model = project.version(1).model
        logger.info("✅ Roboflow model loaded successfully")
    except Exception as e:
        logger.error(f"❌ Error loading Roboflow model: {e}")

def load_car_brand_model():
    """Load car brand detection model from Hugging Face"""
    global car_brand_pipeline
    try:
        processor = AutoImageProcessor.from_pretrained("dima806/car_brands_image_detection")
        model = AutoModelForImageClassification.from_pretrained("dima806/car_brands_image_detection")
        car_brand_pipeline = pipeline("image-classification", model=model, feature_extractor=processor)
        logger.info("✅ Car brand detection model loaded successfully")
    except Exception as e:
        logger.error(f"❌ Error loading car brand model: {e}")

def load_damage_type_model():
    """Load damage type detection model from Hugging Face"""
    global damage_type_pipeline
    try:
        processor = AutoImageProcessor.from_pretrained("beingamit99/car_damage_detection")
        model = AutoModelForImageClassification.from_pretrained("beingamit99/car_damage_detection")
        damage_type_pipeline = pipeline("image-classification", model=model, feature_extractor=processor)
        logger.info("✅ Damage type detection model loaded successfully")
    except Exception as e:
        logger.error(f"❌ Error loading damage type model: {e}")

@app.on_event("startup")
async def startup_event():
    """Load all models on startup"""
    logger.info("🚀 Starting AI AutoExpert Service...")
    
    # Create models directory if it doesn't exist
    os.makedirs("models", exist_ok=True)
    
    # Load all models
    load_gnet_model()
    load_yolo_model()
    load_damage_severity_model()
    load_roboflow_model()
    load_car_brand_model()
    load_damage_type_model()
    
    logger.info("🎉 AI AutoExpert Service started successfully!")

def decode_base64_image(base64_string: str) -> np.ndarray:
    """Decode base64 image to numpy array"""
    image_data = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_data))
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

def encode_image_to_base64(image: np.ndarray) -> str:
    """Encode numpy array image to base64"""
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')

def pil_to_cv2(pil_image: Image.Image) -> np.ndarray:
    """Convert PIL image to OpenCV format"""
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

@app.post("/ai-check")
async def check_ai_generated(request: Dict[str, Any]):
    """Check if image is AI-generated using GNet model"""
    if gnet_model is None:
        raise HTTPException(status_code=500, detail="GNet model not loaded")
    
    try:
        start_time = time.time()
        
        # Decode image
        image = decode_base64_image(request["image"])
        
        # Preprocess for GNet (adjust size based on your model requirements)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_resized = cv2.resize(image_rgb, (224, 224))  # Adjust size if needed
        image_normalized = image_resized / 255.0
        image_batch = np.expand_dims(image_normalized, axis=0)
        
        # Predict
        prediction = gnet_model.predict(image_batch, verbose=0)[0][0]
        
        # Interpret prediction (adjust threshold based on your model)
        is_ai = prediction > 0.5
        confidence = prediction if is_ai else 1 - prediction
        
        processing_time = time.time() - start_time
        
        return {
            "is_ai_generated": bool(is_ai),
            "confidence": float(confidence),
            "processing_time": processing_time,
            "model_used": "gnet.h5"
        }
        
    except Exception as e:
        logger.error(f"AI detection error: {e}")
        raise HTTPException(status_code=500, detail=f"AI detection failed: {str(e)}")

@app.post("/yolo-detect")
async def yolo_detection(request: Dict[str, Any]):
    """Detect car damage using YOLO model"""
    if yolo_model is None:
        raise HTTPException(status_code=500, detail="YOLO model not loaded")
    
    try:
        start_time = time.time()
        
        # Decode image
        image = decode_base64_image(request["image"])
        
        # Run YOLO detection
        results = yolo_model(image)
        
        # Parse results
        detections = []
        annotated_image = image.copy()
        
        for *box, conf, cls in results.xyxy[0].cpu().numpy():
            if conf > 0.3:  # Confidence threshold
                x1, y1, x2, y2 = map(int, box)
                class_name = yolo_model.names[int(cls)]
                
                detections.append({
                    "class": class_name,
                    "confidence": float(conf),
                    "bbox": [x1, y1, x2, y2]
                })
                
                # Draw bounding box
                cv2.rectangle(annotated_image, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(annotated_image, f"{class_name}: {conf:.2f}", 
                           (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        processing_time = time.time() - start_time
        avg_confidence = np.mean([d["confidence"] for d in detections]) if detections else 0
        
        return {
            "detections": detections,
            "confidence": float(avg_confidence),
            "processing_time": processing_time,
            "annotated_image": encode_image_to_base64(annotated_image),
            "model_used": "best.pt"
        }
        
    except Exception as e:
        logger.error(f"YOLO detection error: {e}")
        raise HTTPException(status_code=500, detail=f"YOLO detection failed: {str(e)}")

@app.post("/roboflow-detect")
async def roboflow_detection(request: Dict[str, Any]):
    """Detect car damage using Roboflow model"""
    if roboflow_model is None:
        raise HTTPException(status_code=500, detail="Roboflow model not loaded")
    
    try:
        start_time = time.time()
        
        # Decode image
        image = decode_base64_image(request["image"])
        
        # Save temporary image for Roboflow
        temp_path = "temp_image.jpg"
        cv2.imwrite(temp_path, image)
        
        # Run Roboflow prediction
        prediction = roboflow_model.predict(temp_path, confidence=30, overlap=50)
        
        # Parse results
        detections = []
        annotated_image = image.copy()
        
        for pred in prediction.predictions:
            x1 = int(pred.x - pred.width/2)
            y1 = int(pred.y - pred.height/2)
            x2 = int(pred.x + pred.width/2)
            y2 = int(pred.y + pred.height/2)
            
            detections.append({
                "class": pred.class_name,
                "confidence": pred.confidence,
                "bbox": [x1, y1, x2, y2]
            })
            
            # Draw bounding box
            cv2.rectangle(annotated_image, (x1, y1), (x2, y2), (255, 0, 0), 2)
            cv2.putText(annotated_image, f"{pred.class_name}: {pred.confidence:.2f}", 
                       (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        processing_time = time.time() - start_time
        avg_confidence = np.mean([d["confidence"] for d in detections]) if detections else 0
        
        return {
            "detections": detections,
            "confidence": float(avg_confidence),
            "processing_time": processing_time,
            "annotated_image": encode_image_to_base64(annotated_image),
            "model_used": "roboflow"
        }
        
    except Exception as e:
        logger.error(f"Roboflow detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Roboflow detection failed: {str(e)}")

@app.post("/damage-severity")
async def damage_severity_analysis(request: Dict[str, Any]):
    """Analyze damage severity using car-damage-model.h5"""
    if damage_severity_model is None:
        raise HTTPException(status_code=500, detail="Damage severity model not loaded")
    
    try:
        start_time = time.time()
        
        # Decode image
        image = decode_base64_image(request["image"])
        
        # Preprocess for damage severity model
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_resized = cv2.resize(image_rgb, (224, 224))  # Adjust based on your model
        image_normalized = image_resized / 255.0
        image_batch = np.expand_dims(image_normalized, axis=0)
        
        # Predict severity
        predictions = damage_severity_model.predict(image_batch, verbose=0)[0]
        
        # Define severity classes (adjust based on your model)
        severity_classes = ["minor", "moderate", "severe"]
        
        # Get the predicted severity
        severity_index = np.argmax(predictions)
        severity = severity_classes[severity_index] if severity_index < len(severity_classes) else "unknown"
        confidence = float(predictions[severity_index])
        
        processing_time = time.time() - start_time
        
        return {
            "severity": severity,
            "confidence": confidence,
            "all_predictions": {
                severity_classes[i]: float(predictions[i]) 
                for i in range(min(len(severity_classes), len(predictions)))
            },
            "processing_time": processing_time,
            "model_used": "car-damage-model.h5"
        }
        
    except Exception as e:
        logger.error(f"Damage severity analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Damage severity analysis failed: {str(e)}")

@app.post("/brand-detection")
async def brand_detection(request: Dict[str, Any]):
    """Detect car brand using Hugging Face model"""
    if car_brand_pipeline is None:
        raise HTTPException(status_code=500, detail="Car brand model not loaded")
    
    try:
        start_time = time.time()
        
        # Decode image
        image = decode_base64_image(request["image"])
        pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        
        # Run brand detection
        results = car_brand_pipeline(pil_image)
        
        # Get top prediction
        top_result = results[0] if results else {"label": "unknown", "score": 0.0}
        
        processing_time = time.time() - start_time
        
        return {
            "brand": top_result["label"],
            "confidence": top_result["score"],
            "all_predictions": [
                {"brand": r["label"], "confidence": r["score"]} 
                for r in results[:5]  # Top 5 predictions
            ],
            "processing_time": processing_time,
            "model_used": "dima806/car_brands_image_detection"
        }
        
    except Exception as e:
        logger.error(f"Brand detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Brand detection failed: {str(e)}")

@app.post("/damage-type")
async def damage_type_detection(request: Dict[str, Any]):
    """Detect damage type using Hugging Face model"""
    if damage_type_pipeline is None:
        raise HTTPException(status_code=500, detail="Damage type model not loaded")
    
    try:
        start_time = time.time()
        
        # Decode image
        image = decode_base64_image(request["image"])
        pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        
        # Run damage type detection
        results = damage_type_pipeline(pil_image)
        
        # Filter results with confidence > 0.1
        filtered_results = [r for r in results if r["score"] > 0.1]
        
        processing_time = time.time() - start_time
        
        return {
            "damage_types": [
                {"type": r["label"], "confidence": r["score"]} 
                for r in filtered_results
            ],
            "primary_damage": filtered_results[0]["label"] if filtered_results else "no_damage",
            "processing_time": processing_time,
            "model_used": "beingamit99/car_damage_detection"
        }
        
    except Exception as e:
        logger.error(f"Damage type detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Damage type detection failed: {str(e)}")

@app.post("/complete-analysis")
async def complete_analysis(request: Dict[str, Any]):
    """Run complete analysis using all models"""
    try:
        start_time = time.time()
        
        # Run all analyses
        ai_check = await check_ai_generated(request)
        
        # Only proceed if image is authentic
        if ai_check["is_ai_generated"]:
            return {
                "error": "AI-generated image detected",
                "ai_check": ai_check
            }
        
        # Run detection based on method
        method = request.get("method", "yolo")
        if method == "yolo":
            detection_result = await yolo_detection(request)
        else:
            detection_result = await roboflow_detection(request)
        
        # Run additional analyses
        brand_result = await brand_detection(request)
        damage_type_result = await damage_type_detection(request)
        severity_result = await damage_severity_analysis(request)
        
        total_time = time.time() - start_time
        
        return {
            "ai_check": ai_check,
            "detection": detection_result,
            "brand": brand_result,
            "damage_types": damage_type_result,
            "severity": severity_result,
            "total_processing_time": total_time
        }
        
    except Exception as e:
        logger.error(f"Complete analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Complete analysis failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": {
            "gnet": gnet_model is not None,
            "yolo": yolo_model is not None,
            "damage_severity": damage_severity_model is not None,
            "roboflow": roboflow_model is not None,
            "car_brand": car_brand_pipeline is not None,
            "damage_type": damage_type_pipeline is not None
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
