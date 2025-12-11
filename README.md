# Car Damage Detection System

AI-powered web application for automated car damage detection and analysis using computer vision and deep learning.

## Features

- **Multi-Model Detection**: YOLO and Roboflow integration for accurate damage detection
- **AI Image Verification**: Validates image authenticity using GNet model
- **Brand Recognition**: Identifies car brands using Hugging Face models
- **Damage Classification**: Categorizes damage types (dent, scratch, broken glass, etc.)
- **Severity Analysis**: Assesses damage severity (minor, moderate, severe)
- **Cost Estimation**: Provides repair cost estimates based on damage analysis
- **Real-time Processing**: Fast inference with modern UI/UX

## Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **shadcn/ui**: Beautiful UI components

### Backend
- **FastAPI**: High-performance Python API
- **PyTorch**: Deep learning framework
- **TensorFlow/Keras**: Machine learning models
- **InceptionV3**: AI-generated image detection
- **ResNet50**: Car damage detection
- **Ultralytics YOLOv8**: Object detection
- **Roboflow**: Computer vision platform
- **Transformers**: Hugging Face models

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- pip/npm

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/car-damage-detection.git
cd car-damage-detection

# Install frontend dependencies
npm install

# Install backend dependencies
cd python-ai-service
pip install -r requirements.txt
```

### Configuration

Create `.env` files in both directories:

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend (python-ai-service/.env)**:
```env
ROBOFLOW_API_KEY=your_key_here
```

### Running the Application

```bash
# Terminal 1: Start backend
cd python-ai-service
python main.py

# Terminal 2: Start frontend
npm run dev
```

Access the application at `http://localhost:3000`

## Usage

1. **Upload Image**: Select a car damage image
2. **AI Verification**: System validates image authenticity
3. **Detection Method**: Choose YOLO or Roboflow
4. **Analysis**: View detection results with bounding boxes
5. **Results**: Get damage type, severity, brand, and cost estimate

## API Endpoints

### POST `/ai-check`
Verify if image is AI-generated
```json
{
  "image": "base64_encoded_image"
}
```

### POST `/yolo-detection`
Detect damage using YOLO model
```json
{
  "image": "base64_encoded_image",
  "confidence": 0.5
}
```

### POST `/roboflow-detection`
Detect damage using Roboflow
```json
{
  "image": "base64_encoded_image"
}
```

### POST `/damage-severity`
Analyze damage severity
```json
{
  "image": "base64_encoded_image"
}
```

### POST `/brand-detection`
Identify car brand
```json
{
  "image": "base64_encoded_image"
}
```

### POST `/damage-type`
Classify damage type
```json
{
  "image": "base64_encoded_image"
}
```

### POST `/complete-analysis`
Run full pipeline analysis
```json
{
  "image": "base64_encoded_image",
  "method": "yolo"
}
```

## Models

| Model | Purpose | Source |
|-------|---------|--------|
| InceptionV3 | AI image detection | TensorFlow/Keras |
| ResNet50 | Damage detection | TensorFlow/Keras |
| YOLOv8 | Object detection | Ultralytics |
| Roboflow | Alternative detection | Roboflow API |
| Car Damage Model | Severity analysis | Custom H5 model |
| Car Brand Detector | Brand recognition | dima806/car_brands_image_detection |
| Damage Type Classifier | Damage categorization | beingamit99/car_damage_detection |

## Project Structure

```
car-damage-detection/
├── app/                    # Next.js app directory
│   ├── analysis/          # Analysis page
│   ├── api/               # API routes (proxy)
│   ├── auth/              # Authentication
│   └── dashboard/         # User dashboard
├── components/            # React components
│   ├── ui/               # UI components (shadcn)
│   └── ...               # Feature components
├── python-ai-service/     # Python backend
│   ├── main.py           # FastAPI application
│   ├── models/           # Model files
│   └── requirements.txt  # Python dependencies
└── hooks/                 # React hooks
```

## Development

### Frontend Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend Development
```bash
python main.py   # Start API server
# API docs: http://localhost:8000/docs
```

## Environment Variables

### Required
- `ROBOFLOW_API_KEY`: Roboflow API key for detection

### Optional
- `PORT`: Backend port (default: 8000)
- `NEXT_PUBLIC_API_URL`: Backend URL for frontend

## Features in Detail

### Multi-Step Analysis
1. Upload image validation
2. AI-generated image check
3. Detection method selection
4. Real-time damage detection
5. Comprehensive results display

### Detection Results
- Bounding box visualization
- Confidence scores
- Damage types identified
- Severity assessment
- Brand recognition
- Estimated repair costs

## Performance

- **Detection Speed**: ~2-3 seconds per image
- **Accuracy**: 85-90% on standard damage cases
- **Supported Formats**: JPG, PNG, WebP
- **Max Image Size**: 10MB

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request



## Acknowledgments

- Ultralytics for YOLOv8
- Roboflow for computer vision platform
- Hugging Face for pre-trained models
- shadcn/ui for UI components
