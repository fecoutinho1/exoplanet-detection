#!/usr/bin/env python3
"""
Run the Exoplanet Detection API Server
=====================================

Starts the FastAPI server for exoplanet classification.

Usage:
    python run_api.py

Author: Felipe Coutinho
NASA Space Apps Challenge 2025
"""

import uvicorn
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

if __name__ == "__main__":
    print("Starting Exoplanet Detection API Server...")
    print("Server will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
