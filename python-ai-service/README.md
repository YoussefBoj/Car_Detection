# AI AutoExpert Python Service

This service provides AI-powered vehicle damage detection and analysis using multiple models.

## 🤖 Models Used

1. **GNet (gnet.h5)** - AI-or-not detection
2. **YOLO (best.pt)** - Object detection for car damage
3. **Car Damage Model (car-damage-model.h5)** - Damage severity analysis
4. **Roboflow** - Alternative damage detection via API
5. **Car Brand Detection** - Hugging Face model for brand identification
6. **Damage Type Detection** - Hugging Face model for damage classification

## 🚀 Quick Setup

### 1. Install Python Environment

\`\`\`bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
\`\`\`

### 2. Place Your Models

Create a `models/` directory and place your model files:

\`\`\`
python-ai-service/
├── models/
│   ├── gnet.h5           # Your AI detection model
│   ├── best.pt           # Your YOLO model
│   └── car-damage-model.h5  # Your damage severity model
├── main.py
├── requirements.txt
└── setup.sh
\`\`\`

### 3. Configure Environment

\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit with your API keys
nano .env
\`\`\`

### 4. Start the Service

\`\`\`bash
# Activate virtual environment
source ai_autoexpert_env/bin/activate

# Start the service
python main.py
\`\`\`

## 📡 API Endpoints

- `POST /ai-check` - Check if image is AI-generated
- `POST /yolo-detect` - YOLO object detection
- `POST /roboflow-detect` - Roboflow damage detection
- `POST /damage-severity` - Analyze damage severity
- `POST /brand-detection` - Detect car brand
- `POST /damage-type` - Detect damage types
- `POST /complete-analysis` - Run all analyses
- `GET /health` - Health check

## 🔧 Troubleshooting

### SSL Certificate Issues

If you get SSL errors when accessing models:

1. **For local development**: Use HTTP instead of HTTPS
2. **For production**: Ensure proper SSL certificates
3. **For model files**: Serve them through the FastAPI service, not directly

### Model Loading Issues

1. Check file paths in `models/` directory
2. Verify model file integrity
3. Check Python environment and dependencies
4. Review logs for specific error messages

### Memory Issues

Large models may require significant RAM:
- YOLO model: ~100MB
- Hugging Face models: ~500MB each
- TensorFlow models: Variable size

Consider using model quantization or running on GPU for better performance.

## 🌐 Integration with Next.js

Update your Next.js environment variables:

\`\`\`bash
# .env.local
AI_SERVICE_URL=http://localhost:8000
ROBOFLOW_API_KEY=EJdF3gB2PwrQDNlVhauC
\`\`\`

## 📊 Performance Tips

1. **Use GPU**: Install CUDA-enabled versions for faster inference
2. **Model Caching**: Models are cached in memory after first load
3. **Batch Processing**: Process multiple images together when possible
4. **Image Optimization**: Resize images before sending to reduce processing time
