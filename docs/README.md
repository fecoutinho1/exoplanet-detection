# Exoplanet Detection System
## NASA Space Apps Challenge 2025

<img width="1906" height="1015" alt="image" src="https://github.com/user-attachments/assets/b95cfca0-4c57-4f03-92bb-993a5cee9991" />


### Overview

The Exoplanet Detection System is an advanced machine learning application designed to automatically identify exoplanet candidates from space telescope data. Built specifically for NASA's Space Apps Challenge 2025, this system demonstrates the potential of artificial intelligence in astronomical research and exoplanet discovery.

### System Architecture

The system employs a modular, object-oriented design that separates data processing, model inference, and API functionality into distinct components:

- **ExoplanetDetector Class**: Core machine learning operations including data validation, preprocessing, and prediction
- **ExoplanetAPI Class**: REST API functionality for external integration
- **Utility Functions**: System initialization and configuration management

### Dataset: Kepler Objects of Interest (KOI)

The system is trained on NASA's Kepler Objects of Interest (KOI) dataset, which contains photometric observations from the Kepler Space Telescope mission. The dataset includes:

#### Dataset Statistics
- **Total Observations**: 9,564 Kepler observations
- **Features**: 15 specific characteristics per observation
- **Mission Duration**: 4 years of continuous observations
- **Sky Coverage**: 115 square degrees in the Cygnus-Lyra region

#### Key Features Used

The model utilizes 15 critical features from the KOI dataset:

1. **koi_period**: Orbital period in days
2. **koi_time0bk**: Reference time of first transit
3. **koi_duration**: Transit duration in hours
4. **koi_depth**: Transit depth (dimming fraction)
5. **koi_prad**: Planet radius in Earth units
6. **koi_srad**: Star radius in Solar units
7. **koi_steff**: Star effective temperature in Kelvin
8. **koi_slogg**: Star surface gravity (log g)
9. **koi_kepmag**: Kepler magnitude
10. **koi_model_snr**: Signal-to-noise ratio
11. **koi_score**: Disposition score (0-1)
12. **koi_fpflag_nt**: Not transit flag
13. **koi_fpflag_ss**: Secondary star flag
14. **koi_fpflag_co**: Contamination flag
15. **koi_fpflag_ec**: Eclipse flag

#### Data Quality and Validation

The KOI dataset includes comprehensive quality assessment flags that help distinguish between genuine exoplanet transits and false positives. These flags account for:

- Stellar variability
- Binary star systems
- Instrumental artifacts
- Contamination from nearby stars
- Eclipsing binary stars

### Insights

<img width="653" height="454" alt="output6" src="https://github.com/user-attachments/assets/ecfbd039-9e2f-4bed-8c57-720e6af46009" />
<img width="507" height="410" alt="output1" src="https://github.com/user-attachments/assets/68383e97-c5c4-409a-8811-f14fc2b54d4f" />
<img width="1189" height="490" alt="output3" src="https://github.com/user-attachments/assets/f87b6bd4-5b12-4650-ba30-e9189ed4e775" />
<img width="768" height="547" alt="output4" src="https://github.com/user-attachments/assets/d41299ac-7d3e-40c9-b86c-440ef0265a56" />
<img width="764" height="740" alt="output5" src="https://github.com/user-attachments/assets/4d19f2a6-5eca-4d70-93a0-baecc2c28e25" />

### Machine Learning Model

#### Algorithm: XGBoost Classifier

The system employs an XGBoost (eXtreme Gradient Boosting) classifier, chosen for its:
- High performance on tabular data
- Robust handling of missing values
- Excellent generalization capabilities
- Interpretable feature importance

#### Performance Metrics

The model achieves exceptional performance on the Kepler dataset:

- **Accuracy**: 98.74%
- **Precision**: 98.17%
- **Recall**: 99.24%
- **F1-Score**: 98.70%

#### Training Methodology

The training process implements GroupShuffleSplit to prevent data leakage, ensuring that all observations from the same star are either in the training or test set. This approach is crucial for astronomical data where multiple observations of the same object could lead to overfitting.

### Data Processing Pipeline

#### Input Validation
- Dictionary format validation
- Feature completeness verification
- Data type checking
- Range validation for critical parameters

#### Preprocessing Steps
1. **Missing Value Imputation**: Median value replacement for missing data
2. **Data Normalization**: StandardScaler transformation
3. **Feature Selection**: Automatic selection of required features
4. **Quality Assessment**: Integration of KOI quality flags

#### Output Format
The system returns comprehensive classification results including:
- Binary prediction (exoplanet/not exoplanet)
- Confidence score (0-100%)
- Probability distributions
- Feature importance analysis
- Quality assessment summary

### Mission Generalization Strategy

#### Current Scope
The present implementation is specifically optimized for Kepler mission data, providing high accuracy and reliability for this well-characterized dataset.

#### Multi-Mission Potential
The underlying architecture supports expansion to other NASA missions:

**TESS (Transiting Exoplanet Survey Satellite)**
- Shorter observation periods (27 days vs 4 years)
- Brighter star targets
- Different feature naming conventions
- Broader sky coverage

**James Webb Space Telescope**
- Spectroscopic observations
- Different detection methodology
- Higher precision measurements
- Infrared wavelength focus

#### Technical Implementation Approach

**Mission Detection Module**
- Automatic source mission identification
- Feature name mapping
- Data format routing

**Modular Preprocessing**
- Mission-specific data cleaning
- Unit conversion and normalization
- Quality flag adaptation

**Ensemble Classification**
- Multiple mission-specific models
- Weighted prediction combination
- Cross-mission validation

### API Integration

#### RESTful Interface
The system provides a comprehensive REST API for integration with external applications:

**Endpoints**
- `/predict`: Main classification endpoint
- `/health`: System status check
- `/model-info`: Model metadata and statistics

**Request Format**
```json
{
  "candidate_data": {
    "koi_period": 365.25,
    "koi_duration": 12.0,
    "koi_depth": 0.01,
    // ... additional features
  }
}
```

**Response Format**
```json
{
  "status": "success",
  "data": {
    "prediction": 1,
    "confidence": 95.2,
    "probabilities": {
      "exoplanet": 0.952,
      "false_positive": 0.048
    },
    "explanation": "Candidate classified as exoplanet with 95.2% confidence"
  }
}
```

### Scientific Impact

#### Research Applications
- Automated exoplanet candidate screening
- Large-scale survey data analysis
- False positive reduction
- Discovery efficiency improvement

#### Educational Value
- Demonstrates ML applications in astronomy
- Provides hands-on experience with real NASA data
- Illustrates data science best practices
- Showcases open-source scientific software

### Future Development

#### Short-term Goals
- TESS mission integration
- Performance optimization
- Enhanced visualization tools
- Extended documentation

#### Long-term Vision
- Multi-mission support
- Real-time data processing
- Advanced ensemble methods
- Community-driven development

### Technical Requirements

#### System Dependencies
- Python 3.8+
- XGBoost 1.7+
- scikit-learn 1.0+
- pandas 1.3+
- numpy 1.21+

#### Hardware Recommendations
- Minimum: 4GB RAM, 2 CPU cores
- Recommended: 8GB RAM, 4 CPU cores
- Storage: 1GB for model files and dependencies

### Contributing

This project welcomes contributions from the scientific and developer communities. Areas of particular interest include:

- Additional mission support
- Model performance improvements
- Documentation enhancements
- Visualization features
- API extensions

### License

This project is developed for the NASA Space Apps Challenge 2025 and follows open-source best practices for scientific software development.

### Contact

For questions, suggestions, or collaboration opportunities, please refer to the project repository or contact the development team through the NASA Space Apps Challenge platform.

---

*This documentation represents the current state of the Exoplanet Detection System as of the NASA Space Apps Challenge 2025 submission. The system continues to evolve based on community feedback and scientific requirements.*
