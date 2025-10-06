# Exoplanet Detection System
## NASA Space Apps Challenge 2025

### Project Overview

This project implements an automated machine learning system for exoplanet detection using data from NASA's Kepler Space Telescope mission. The system achieves 98.74% accuracy in classifying exoplanet candidates and provides a production-ready solution for astronomical data analysis.

### Mission Scope

**Current Implementation**: Kepler Space Telescope data only
**Future Expansion**: Multi-mission support (TESS, James Webb, etc.)

This system is specifically designed and trained for Kepler data, which provides the most comprehensive and validated dataset for exoplanet detection. The methodology and architecture can be extended to other NASA missions as documented in the technical architecture files.

### Key Features

- **High Accuracy**: 98.74% classification accuracy on Kepler data
- **Production Ready**: Object-oriented design with REST API support
- **Comprehensive Validation**: Proper train-test split preventing data leakage
- **Explainable AI**: SHAP values for decision interpretation
- **Scalable Architecture**: Modular design for easy expansion

### Technical Specifications

- **Algorithm**: XGBoost Classifier
- **Features**: 15 scientific characteristics from Kepler data
- **Data Source**: NASA Kepler mission (9,564 observations)
- **Validation**: GroupShuffleSplit with proper data separation
- **Performance**: 98.74% accuracy, 98.17% precision, 99.24% recall

### Required Files

The system requires three essential files to operate:
- `exoplanet_detector_model.pkl` - Trained XGBoost model
- `exoplanet_scaler.pkl` - Data normalization scaler
- `exoplanet_features.pkl` - List of required features

### Usage

#### Basic Classification

```python
from exoplanet_detector_model import ExoplanetDetector

# Create detector
detector = ExoplanetDetector()

# Prepare candidate data (Kepler format)
candidate_data = {
    "kepid": 10797460,
    "koi_score": 1.0,
    "koi_fpflag_nt": 0,
    "koi_fpflag_ss": 0,
    "koi_fpflag_co": 0,
    "koi_fpflag_ec": 0,
    "koi_period": 9.488036,
    "koi_time0bk": 170.53875,
    "koi_duration": 2.9575,
    "koi_depth": 615.8,
    "koi_prad": 2.26,
    "koi_srad": 0.927,
    "koi_steff": 5778.0,
    "koi_slogg": 4.467,
    "koi_kepmag": 15.347,
    "koi_model_snr": 35.8
}

# Classify candidate
result = detector.predict(candidate_data)
print(f"Prediction: {result['prediction_text']}")
print(f"Confidence: {result['confidence']:.1f}%")
```

#### API Usage

```python
from exoplanet_detector_model import ExoplanetAPI

# Create API instance
api = ExoplanetAPI(ExoplanetDetector())

# Process request
request_data = {"candidate_data": candidate_data}
response = api.process_request(request_data)
```

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure model files are present in the working directory
3. Run the example:
```bash
python example_usage.py
```

### Project Structure

```
final_nasa_2025/
├── exoplanet_detector_model.py    # Main ML system
├── example_usage.py               # Usage examples
├── requirements.txt               # Dependencies
├── README.md                      # This file
├── MISSION_GENERALIZATION.md      # Multi-mission expansion details
├── TECHNICAL_ARCHITECTURE.md     # Technical implementation details
└── model_files/                   # Required .pkl files
    ├── exoplanet_detector_model.pkl
    ├── exoplanet_scaler.pkl
    └── exoplanet_features.pkl
```

### Scientific Background

The system uses the transit method for exoplanet detection, which measures periodic dips in stellar brightness caused by planets passing between their host star and Earth. The machine learning model learns to distinguish between genuine exoplanet transits and false positives caused by stellar variability, instrumental noise, or other astrophysical phenomena.

### Mission Compatibility

While the current implementation is optimized for Kepler data, the underlying methodology can be extended to other NASA missions. Detailed information about multi-mission support and generalization strategies is provided in the accompanying documentation files.

### Performance Metrics

- **Accuracy**: 98.74%
- **Precision**: 98.17%
- **Recall**: 99.24%
- **F1-Score**: 98.70%
- **ROC AUC**: 99.85%

### Future Development

The system is designed with extensibility in mind. Future versions will support:
- TESS mission data
- James Webb Space Telescope data
- Multi-mission ensemble predictions
- Real-time data processing
- Cloud deployment

### License

MIT License - Open source for scientific and educational use.

### Contact

For questions about this implementation or collaboration opportunities, please refer to the NASA Space Apps Challenge 2025 project documentation.

### References

- NASA Kepler Mission: https://www.nasa.gov/mission_pages/kepler/
- Exoplanet Archive: https://exoplanetarchive.ipac.caltech.edu/
- NASA Space Apps Challenge: https://www.spaceappschallenge.org/
