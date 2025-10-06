"""
Exoplanet Detection Model
=========================

Exoplanet classification system using Machine Learning.
Implemented in Object-Oriented Programming for production use.

This system is specifically designed for Kepler Space Telescope data.
For multi-mission support and generalization details, see:
- MISSION_GENERALIZATION.md
- TECHNICAL_ARCHITECTURE.md

Author: Felipe Coutinho
NASA Space Apps Challenge 2025
"""

import pandas as pd
import numpy as np
import joblib
import pickle
from typing import Dict, List, Optional, Union, Tuple
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ExoplanetDetector:
    """
    Main class for exoplanet detection.
    
    This class encapsulates the entire process of classifying exoplanet
    candidates using a trained XGBoost model.
    """
    
    def __init__(self, model_path: str = "exoplanet_detector_model.pkl",
                 scaler_path: str = "exoplanet_scaler.pkl",
                 features_path: str = "exoplanet_features.pkl"):
        """
        Initialize the exoplanet detector.
        
        Args:
            model_path: Path to the trained model file
            scaler_path: Path to the scaler file
            features_path: Path to the features list file
        """
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.features_path = features_path
        
        self.model = None
        self.scaler = None
        self.features = None
        self.is_loaded = False
        
        # Load components automatically
        self.load_components()
    
    def load_components(self) -> bool:
        """
        Load the model, scaler and required features.
        
        Returns:
            bool: True if loaded successfully, False otherwise
        """
        try:
            logger.info("Loading model components...")
            
            # Load XGBoost model
            self.model = joblib.load(self.model_path)
            logger.info(f"Model loaded from: {self.model_path}")
            
            # Load scaler
            self.scaler = joblib.load(self.scaler_path)
            logger.info(f"Scaler loaded from: {self.scaler_path}")
            
            # Load features list
            with open(self.features_path, 'rb') as f:
                self.features = pickle.load(f)
            logger.info(f"Features loaded from: {self.features_path}")
            
            self.is_loaded = True
            logger.info("All components loaded successfully")
            return True
            
        except FileNotFoundError as e:
            logger.error(f"File not found: {e}")
            return False
        except Exception as e:
            logger.error(f"Error loading components: {e}")
            return False
    
    def validate_input(self, data: Dict) -> Tuple[bool, List[str]]:
        """
        Validate if input data contains all required features.
        
        Args:
            data: Dictionary with candidate data
            
        Returns:
            Tuple[bool, List[str]]: (is_valid, error_list)
        """
        if not isinstance(data, dict):
            return False, ["Data must be a dictionary"]
        
        if not self.features:
            return False, ["Features not loaded"]
        
        missing_features = set(self.features) - set(data.keys())
        if missing_features:
            return False, [f"Missing features: {list(missing_features)}"]
        
        return True, []
    
    def preprocess_data(self, data: Dict) -> np.ndarray:
        """
        Preprocess candidate data for classification.
        
        Args:
            data: Dictionary with candidate data
            
        Returns:
            np.ndarray: Preprocessed and normalized data
        """
        # Convert to DataFrame
        df = pd.DataFrame([data])
        
        # Select only required features
        X = df[self.features].copy()
        
        # Handle missing values
        for column in X.columns:
            if X[column].isnull().any():
                median_value = X[column].median()
                X[column] = X[column].fillna(median_value)
                logger.warning(f"Missing value filled in {column}: {median_value}")
        
        # Normalize data
        X_normalized = self.scaler.transform(X)
        
        return X_normalized
    
    def predict(self, data: Dict) -> Dict:
        """
        MAIN FUNCTION: Classify exoplanet candidate.
        
        This is the main entry point for the API. It receives candidate data
        and returns the classification result.
        
        Args:
            data: Dictionary with candidate data containing all required features:
                  - kepid: Star ID
                  - koi_score: Confidence score (0-1)
                  - koi_fpflag_nt: Not transit flag (0/1)
                  - koi_fpflag_ss: Secondary star flag (0/1)
                  - koi_fpflag_co: Contamination flag (0/1)
                  - koi_fpflag_ec: Eclipse flag (0/1)
                  - koi_period: Orbital period (days)
                  - koi_time0bk: Reference time
                  - koi_duration: Transit duration (hours)
                  - koi_depth: Transit depth
                  - koi_prad: Planet radius (Earth units)
                  - koi_srad: Star radius (Solar units)
                  - koi_steff: Star temperature (Kelvin)
                  - koi_slogg: Surface gravity log
                  - koi_kepmag: Kepler magnitude
                  - koi_model_snr: Signal-to-noise ratio
            
        Returns:
            Dict: Classification result with prediction, confidence, and explanation
        """
        if not self.is_loaded:
            return {
                "success": False,
                "error": "Model not loaded",
                "prediction": None
            }
        
        # Validate input
        is_valid, errors = self.validate_input(data)
        if not is_valid:
            return {
                "success": False,
                "error": "; ".join(errors),
                "prediction": None
            }
        
        try:
            # Preprocess data
            X_processed = self.preprocess_data(data)
            
            # Make prediction
            prediction = self.model.predict(X_processed)[0]
            probabilities = self.model.predict_proba(X_processed)[0]
            
            # Calculate confidence
            confidence = max(probabilities) * 100
            
            # Interpret result
            if prediction == 1:
                result_text = "EXOPLANET DETECTED"
                explanation = f"Candidate classified as exoplanet with {confidence:.1f}% confidence"
            else:
                result_text = "NOT AN EXOPLANET"
                explanation = f"Candidate classified as false positive with {confidence:.1f}% confidence"
            
            return {
                "success": True,
                "prediction": int(prediction),
                "prediction_text": result_text,
                "probability_exoplanet": float(probabilities[1]),
                "probability_false_positive": float(probabilities[0]),
                "confidence": float(confidence),
                "explanation": explanation,
                "features_used": self.features
            }
            
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            return {
                "success": False,
                "error": str(e),
                "prediction": None
            }
    
    def get_model_info(self) -> Dict:
        """
        Return information about the loaded model.
        
        Returns:
            Dict: Model information
        """
        if not self.is_loaded:
            return {"loaded": False}
        
        return {
            "loaded": True,
            "model_type": "XGBoost",
            "features_count": len(self.features),
            "features": self.features,
            "model_path": self.model_path,
            "scaler_path": self.scaler_path,
            "features_path": self.features_path
        }


class ExoplanetAPI:
    """
    Class for REST API interface.
    
    Provides methods for REST API integration and HTTP request processing.
    """
    
    def __init__(self, detector: ExoplanetDetector):
        """
        Initialize the API interface.
        
        Args:
            detector: ExoplanetDetector instance
        """
        self.detector = detector
    
    def process_request(self, request_data: Dict) -> Dict:
        """
        Process a classification request.
        
        Args:
            request_data: HTTP request data
            
        Returns:
            Dict: Formatted API response
        """
        # Validate request structure
        if "candidate_data" not in request_data:
            return {
                "status": "error",
                "message": "Field 'candidate_data' is required",
                "data": None
            }
        
        candidate_data = request_data["candidate_data"]
        
        # Make prediction
        result = self.detector.predict(candidate_data)
        
        if result["success"]:
            return {
                "status": "success",
                "message": "Classification completed successfully",
                "data": {
                    "prediction": result["prediction"],
                    "prediction_text": result["prediction_text"],
                    "confidence": result["confidence"],
                    "probabilities": {
                        "exoplanet": result["probability_exoplanet"],
                        "false_positive": result["probability_false_positive"]
                    },
                    "explanation": result["explanation"]
                }
            }
        else:
            return {
                "status": "error",
                "message": result["error"],
                "data": None
            }
    
    def health_check(self) -> Dict:
        """
        Check if the system is working.
        
        Returns:
            Dict: System status
        """
        model_info = self.detector.get_model_info()
        
        return {
            "status": "healthy" if model_info["loaded"] else "unhealthy",
            "model_loaded": model_info["loaded"],
            "timestamp": pd.Timestamp.now().isoformat()
        }


def create_detector() -> ExoplanetDetector:
    """
    Convenience function to create a detector.
    
    Returns:
        ExoplanetDetector: Configured detector instance
    """
    return ExoplanetDetector()


def create_api() -> ExoplanetAPI:
    """
    Convenience function to create an API.
    
    Returns:
        ExoplanetAPI: Configured API instance
    """
    detector = create_detector()
    return ExoplanetAPI(detector)

