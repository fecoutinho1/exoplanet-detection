#!/usr/bin/env python3
"""
Simple test script for the Exoplanet Detection API
"""

import requests
import json

def test_api():
    # Test health endpoint
    try:
        response = requests.get('http://localhost:8000/health')
        print("Health Check Response:")
        print(json.dumps(response.json(), indent=2))
        print("-" * 50)
    except Exception as e:
        print(f"Health check failed: {e}")
        return

    # Test CSV upload
    try:
        with open('output_15_linhas.csv', 'rb') as f:
            files = {'file': f}
            response = requests.post('http://localhost:8000/predict-csv', files=files)
            
        print("CSV Upload Response:")
        result = response.json()
        print(f"Status: {result.get('status')}")
        print(f"Message: {result.get('message')}")
        print(f"Summary: {result.get('summary')}")
        
        if result.get('results'):
            print(f"First result: {result['results'][0]}")
            print(f"Original data in first result: {result['results'][0].get('original_data')}")
        
    except Exception as e:
        print(f"CSV upload test failed: {e}")

if __name__ == "__main__":
    test_api()
