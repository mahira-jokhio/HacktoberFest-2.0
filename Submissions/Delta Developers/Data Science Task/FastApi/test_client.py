#!/usr/bin/env python3
"""
Test client for the Machine Failure Prediction API
"""
import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 50)

def test_single_prediction():
    """Test single prediction endpoint"""
    print("Testing single prediction...")
    
    # Sample data
    test_data = {
        "Type": "M",
        "Air_temperature_K": 298.1,
        "Process_temperature_K": 308.6,
        "Rotational_speed_rpm": 1551,
        "Torque_Nm": 42.8,
        "Tool_wear_min": 0
    }
    
    response = requests.post(f"{BASE_URL}/predict", json=test_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 50)

def test_batch_prediction():
    """Test batch prediction endpoint"""
    print("Testing batch prediction...")
    
    # Sample batch data
    batch_data = {
        "machines": [
            {
                "Type": "L",
                "Air_temperature_K": 295.3,
                "Process_temperature_K": 305.7,
                "Rotational_speed_rpm": 1408,
                "Torque_Nm": 46.3,
                "Tool_wear_min": 3
            },
            {
                "Type": "H",
                "Air_temperature_K": 302.5,
                "Process_temperature_K": 313.1,
                "Rotational_speed_rpm": 1695,
                "Torque_Nm": 35.5,
                "Tool_wear_min": 9
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/batch-predict", json=batch_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 50)

def test_model_info():
    """Test model info endpoint"""
    print("Testing model info endpoint...")
    response = requests.get(f"{BASE_URL}/model-info")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 50)

if __name__ == "__main__":
    print("Machine Failure Prediction API Test Client")
    print("=" * 50)
    
    try:
        # Test all endpoints
        test_health()
        test_model_info()
        test_single_prediction()
        test_batch_prediction()
        
        print("All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API server.")
        print("Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"Error: {e}")