# Exoplanet Detection API

FastAPI backend for exoplanet classification system using XGBoost machine learning model.

## Features

- **CSV Processing**: Upload and process CSV files with exoplanet data
- **JSON API**: Process individual data points via JSON requests
- **Real-time Classification**: XGBoost model with 98.74% accuracy
- **Batch Processing**: Process multiple candidates simultaneously
- **CORS Enabled**: Ready for frontend integration

## Installation

1. Install dependencies:
```bash
pip install -r requirements_api.txt
```

2. Ensure model files are present:
- `exoplanet_detector_model.pkl`
- `exoplanet_scaler.pkl`
- `exoplanet_features.pkl`

## Running the API

```bash
python run_api.py
```

The API will be available at:
- **API Server**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## API Endpoints

### Health Check
```
GET /health
```
Returns system status and model information.

### Model Information
```
GET /model-info
```
Returns detailed model information and required features.

### Single Prediction
```
POST /predict
```
Process a single exoplanet candidate.

**Request Body:**
```json
{
  "candidate_data": {
    "kepid": 10797460,
    "koi_score": 1.0,
    "koi_fpflag_nt": 0,
    "koi_fpflag_ss": 0,
    "koi_fpflag_co": 0,
    "koi_fpflag_ec": 0,
    "koi_period": 9.48803557,
    "koi_time0bk": 170.53875,
    "koi_duration": 2.9575,
    "koi_depth": 615.8,
    "koi_prad": 2.26,
    "koi_srad": 0.927,
    "koi_steff": 5455.0,
    "koi_slogg": 4.467,
    "koi_kepmag": 15.347,
    "koi_model_snr": 35.8
  }
}
```

### CSV File Processing
```
POST /predict-csv
```
Upload and process a CSV file with multiple candidates.

**Request:** Multipart form data with CSV file

**Response:**
```json
{
  "status": "success",
  "message": "Processed 15 rows from data.csv",
  "summary": {
    "total_rows": 15,
    "successful_predictions": 15,
    "failed_predictions": 0,
    "exoplanets_detected": 8,
    "false_positives": 7,
    "success_rate": "100.0%"
  },
  "results": [...]
}
```

### JSON Data Processing
```
POST /predict-json
```
Process multiple data points via JSON.

**Request Body:**
```json
{
  "data": [
    {
      "kepid": 10797460,
      "koi_score": 1.0,
      ...
    }
  ]
}
```

## Required Features

The model requires exactly 15 features:

1. **kepid**: Star ID (integer)
2. **koi_score**: Confidence score (0-1, float)
3. **koi_fpflag_nt**: Not transit flag (0/1, binary)
4. **koi_fpflag_ss**: Secondary star flag (0/1, binary)
5. **koi_fpflag_co**: Contamination flag (0/1, binary)
6. **koi_fpflag_ec**: Eclipse flag (0/1, binary)
7. **koi_period**: Orbital period in days (float)
8. **koi_time0bk**: Reference time (float)
9. **koi_duration**: Transit duration in hours (float)
10. **koi_depth**: Transit depth (float)
11. **koi_prad**: Planet radius in Earth units (float)
12. **koi_srad**: Star radius in Solar units (float)
13. **koi_steff**: Star effective temperature in Kelvin (float)
14. **koi_slogg**: Star surface gravity log (float)
15. **koi_kepmag**: Kepler magnitude (float)
16. **koi_model_snr**: Signal-to-noise ratio (float)

## Response Format

All successful predictions return:

```json
{
  "success": true,
  "prediction": 1,
  "prediction_text": "EXOPLANET DETECTED",
  "confidence": 95.2,
  "probabilities": {
    "exoplanet": 0.952,
    "false_positive": 0.048
  },
  "explanation": "Candidate classified as exoplanet with 95.2% confidence"
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- **200**: Success
- **400**: Bad Request (missing features, invalid data)
- **500**: Internal Server Error (model issues, processing errors)

## Frontend Integration

The API is configured with CORS to work with the React frontend running on:
- http://localhost:3000
- http://127.0.0.1:3000

## Model Performance

- **Accuracy**: 98.74%
- **Precision**: 98.17%
- **Recall**: 99.24%
- **F1-Score**: 98.70%
- **Training Data**: 9,564 Kepler observations
- **Features**: 15 required features
- **Algorithm**: XGBoost Classifier

## Development

For development with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Production Deployment

For production deployment:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## License

NASA Space Apps Challenge 2025 - Exoplanet Detection System
