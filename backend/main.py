"""
Exoplanet Detection API
======================

FastAPI backend for exoplanet classification system.
Processes CSV data and returns classification results.

Author: Felipe Coutinho
NASA Space Apps Challenge 2025
"""

import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import io
import logging
from exoplanet_detector_model import ExoplanetDetector, ExoplanetAPI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Exoplanet Detection API",
    description="NASA Space Apps Challenge 2025 - Exoplanet Classification System",
    version="2.0.1"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize detector and API
detector = ExoplanetDetector()
api = ExoplanetAPI(detector)

# Required features for the model
REQUIRED_FEATURES = [
    'kepid', 'koi_score', 'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 
    'koi_fpflag_ec', 'koi_period', 'koi_time0bk', 'koi_duration', 'koi_depth',
    'koi_prad', 'koi_srad', 'koi_steff', 'koi_slogg', 'koi_kepmag', 'koi_model_snr'
]

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Exoplanet Detection API",
        "version": "2.0.1",
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "predict_single": "/predict",
            "predict_csv": "/predict-csv",
            "model_info": "/model-info",
            "test_csv": "/test-csv"
        }
    }

@app.post("/test-csv")
async def test_csv(file: UploadFile = File(...)):
    """
    Test endpoint to check CSV parsing without full processing.
    """
    try:
        contents = await file.read()
        csv_content = contents.decode('utf-8')
        
        lines = csv_content.strip().split('\n')
        lines = [line.strip() for line in lines if line.strip()]
        
        return {
            "status": "success",
            "filename": file.filename,
            "total_lines": len(lines),
            "content_length": len(csv_content),
            "first_line": lines[0] if lines else "No content",
            "sample_lines": lines[:3] if len(lines) > 1 else []
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "filename": file.filename
        }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    health_status = api.health_check()
    return health_status

@app.get("/model-info")
async def model_info():
    """Get model information and required features."""
    model_info = detector.get_model_info()
    return {
        "model_info": model_info,
        "required_features": REQUIRED_FEATURES,
        "feature_count": len(REQUIRED_FEATURES)
    }

@app.post("/predict")
async def predict_single(request_data: Dict[str, Any]):
    """
    Predict exoplanet classification for a single candidate.
    
    Expected format:
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
    """
    try:
        result = api.process_request(request_data)
        return result
    except Exception as e:
        logger.error(f"Error in predict_single: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-csv")
async def predict_csv(file: UploadFile = File(...)):
    """
    Process CSV file and return classification results for each row.
    
    Expected CSV format with columns: kepid, koi_score, koi_fpflag_nt, etc.
    """
    try:
        # Read CSV file
        contents = await file.read()
        csv_content = contents.decode('utf-8')
        
        # Clean up any potential issues with the CSV
        lines = csv_content.strip().split('\n')
        # Remove any empty lines
        lines = [line for line in lines if line.strip()]
        csv_content = '\n'.join(lines)
        
        # Log CSV info for debugging
        logger.info(f"Processing CSV file: {file.filename}")
        logger.info(f"CSV content length: {len(csv_content)} characters")
        logger.info(f"Number of lines: {len(lines)}")
        
        # Read CSV with more robust parameters - ignore bad lines completely
        df = pd.read_csv(
            io.StringIO(csv_content),
            encoding='utf-8',
            on_bad_lines='skip',  # Skip problematic lines
            skip_blank_lines=True,
            engine='python',  # Use Python engine for better error handling
            error_bad_lines=False,  # Don't raise error on bad lines
            warn_bad_lines=False    # Don't warn about bad lines
        )
        
        logger.info(f"Successfully loaded CSV with {len(df)} rows and {len(df.columns)} columns")
        
        # Validate required columns
        missing_columns = set(REQUIRED_FEATURES) - set(df.columns)
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {list(missing_columns)}"
            )
        
        # Process each row
        results = []
        for index, row in df.iterrows():
            try:
                # Extract required features
                candidate_data = {feature: row[feature] for feature in REQUIRED_FEATURES}
                
                # Make prediction
                prediction_result = detector.predict(candidate_data)
                
                # Format result
                result = {
                    "row_index": int(index),
                    "kepid": int(row.get('kepid', 0)),
                    "kepoi_name": str(row.get('kepoi_name', '')),
                    "kepler_name": str(row.get('kepler_name', '')),
                    "success": prediction_result["success"],
                    "prediction": prediction_result.get("prediction"),
                    "prediction_text": prediction_result.get("prediction_text"),
                    "confidence": prediction_result.get("confidence"),
                    "probability_exoplanet": prediction_result.get("probability_exoplanet"),
                    "probability_false_positive": prediction_result.get("probability_false_positive"),
                    "explanation": prediction_result.get("explanation"),
                    "error": prediction_result.get("error"),
                    # Include original data for display
                    "original_data": {
                        "koi_period": float(row.get('koi_period', 0)),
                        "koi_prad": float(row.get('koi_prad', 0)),
                        "koi_srad": float(row.get('koi_srad', 0)),
                        "koi_steff": float(row.get('koi_steff', 0)),
                        "koi_depth": float(row.get('koi_depth', 0)),
                        "koi_duration": float(row.get('koi_duration', 0)),
                        "koi_time0bk": float(row.get('koi_time0bk', 0))
                    }
                }
                
                results.append(result)
                
            except Exception as e:
                logger.error(f"Error processing row {index}: {e}")
                results.append({
                    "row_index": int(index),
                    "kepid": int(row.get('kepid', 0)),
                    "kepoi_name": str(row.get('kepoi_name', '')),
                    "kepler_name": str(row.get('kepler_name', '')),
                    "success": False,
                    "error": str(e)
                })
        
        # Summary statistics
        total_rows = len(results)
        successful_predictions = sum(1 for r in results if r["success"])
        exoplanet_count = sum(1 for r in results if r.get("prediction") == 1)
        false_positive_count = sum(1 for r in results if r.get("prediction") == 0)
        
        return {
            "status": "success",
            "message": f"Processed {total_rows} rows from {file.filename}",
            "summary": {
                "total_rows": total_rows,
                "successful_predictions": successful_predictions,
                "failed_predictions": total_rows - successful_predictions,
                "exoplanets_detected": exoplanet_count,
                "false_positives": false_positive_count,
                "success_rate": f"{(successful_predictions/total_rows)*100:.1f}%" if total_rows > 0 else "0%"
            },
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Error processing CSV file: {e}")
        # Try alternative CSV parsing if the first attempt fails
        try:
            logger.info("Attempting alternative CSV parsing...")
            contents = await file.read()
            csv_content = contents.decode('utf-8')
            
            # More aggressive cleaning
            lines = csv_content.strip().split('\n')
            lines = [line.strip() for line in lines if line.strip()]
            
            # Count columns in header to ensure consistency
            if lines:
                header_cols = len(lines[0].split(','))
                logger.info(f"Header has {header_cols} columns")
                
                # Filter lines to match header column count
                filtered_lines = [lines[0]]  # Keep header
                for i, line in enumerate(lines[1:], 1):
                    if len(line.split(',')) == header_cols:
                        filtered_lines.append(line)
                    else:
                        logger.warning(f"Skipping line {i+1}: column count mismatch")
                
                csv_content = '\n'.join(filtered_lines)
                
                df = pd.read_csv(
                    io.StringIO(csv_content),
                    encoding='utf-8',
                    engine='python',
                    error_bad_lines=False,
                    warn_bad_lines=False
                )
                
                logger.info(f"Alternative parsing successful: {len(df)} rows loaded")
                
        except Exception as e2:
            logger.error(f"Alternative parsing also failed: {e2}")
            raise HTTPException(
                status_code=500, 
                detail=f"CSV parsing failed: {str(e)}. Please ensure your CSV file is properly formatted."
            )

@app.post("/predict-json")
async def predict_json(request_data: Dict[str, Any]):
    """
    Process JSON data and return classification results.
    
    Expected format:
    {
        "data": [
            {
                "kepid": 10797460,
                "koi_score": 1.0,
                "koi_fpflag_nt": 0,
                ...
            }
        ]
    }
    """
    try:
        if "data" not in request_data:
            raise HTTPException(status_code=400, detail="Missing 'data' field in request")
        
        data_list = request_data["data"]
        if not isinstance(data_list, list):
            raise HTTPException(status_code=400, detail="'data' must be a list")
        
        # Process each data point
        results = []
        for index, data_point in enumerate(data_list):
            try:
                # Validate required features
                missing_features = set(REQUIRED_FEATURES) - set(data_point.keys())
                if missing_features:
                    results.append({
                        "row_index": index,
                        "success": False,
                        "error": f"Missing features: {list(missing_features)}"
                    })
                    continue
                
                # Make prediction
                prediction_result = detector.predict(data_point)
                
                # Format result
                result = {
                    "row_index": index,
                    "kepid": data_point.get('kepid', 0),
                    "success": prediction_result["success"],
                    "prediction": prediction_result.get("prediction"),
                    "prediction_text": prediction_result.get("prediction_text"),
                    "confidence": prediction_result.get("confidence"),
                    "probability_exoplanet": prediction_result.get("probability_exoplanet"),
                    "probability_false_positive": prediction_result.get("probability_false_positive"),
                    "explanation": prediction_result.get("explanation"),
                    "error": prediction_result.get("error")
                }
                
                results.append(result)
                
            except Exception as e:
                logger.error(f"Error processing data point {index}: {e}")
                results.append({
                    "row_index": index,
                    "success": False,
                    "error": str(e)
                })
        
        # Summary statistics
        total_items = len(results)
        successful_predictions = sum(1 for r in results if r["success"])
        exoplanet_count = sum(1 for r in results if r.get("prediction") == 1)
        false_positive_count = sum(1 for r in results if r.get("prediction") == 0)
        
        return {
            "status": "success",
            "message": f"Processed {total_items} data points",
            "summary": {
                "total_items": total_items,
                "successful_predictions": successful_predictions,
                "failed_predictions": total_items - successful_predictions,
                "exoplanets_detected": exoplanet_count,
                "false_positives": false_positive_count,
                "success_rate": f"{(successful_predictions/total_items)*100:.1f}%" if total_items > 0 else "0%"
            },
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Error processing JSON data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
