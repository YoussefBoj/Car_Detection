echo "🚀 Setting up AI AutoExpert Python Service..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python -m venv ai_autoexpert_env

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source ai_autoexpert_env/bin/activate  # On Windows: ai_autoexpert_env\Scripts\activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📚 Installing requirements..."
pip install -r requirements.txt

# Create models directory
echo "📁 Creating models directory..."
mkdir -p models

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Place your model files in the models/ directory:"
echo "   - models/gnet.h5 (AI detection model)"
echo "   - models/best.pt (YOLO model)"
echo "   - models/car-damage-model.h5 (Damage severity model)"
echo ""
echo "2. Set environment variables:"
echo "   export ROBOFLOW_API_KEY='EJdF3gB2PwrQDNlVhauC'"
echo ""
echo "3. Start the service:"
echo "   python main.py"
echo ""
echo "🌐 Service will be available at: http://localhost:8000"
echo "📖 API documentation: http://localhost:8000/docs"
