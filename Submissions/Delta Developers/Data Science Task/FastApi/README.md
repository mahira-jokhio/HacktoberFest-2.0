# Machine Failure Prediction API

A comprehensive FastAPI application for predicting machine failures using machine learning models.

## Features

- **Single Predictions**: Predict failure for individual machines
- **Batch Predictions**: Process multiple machines at once (up to 100)
- **Health Monitoring**: Check API and model status
- **Input Validation**: Comprehensive data validation with Pydantic
- **Error Handling**: Robust error handling and logging
- **CORS Support**: Cross-origin resource sharing enabled
- **Interactive Documentation**: Auto-generated API docs
- **Risk Assessment**: Provides risk levels (Low/Medium/High)
- **Probability Scores**: Returns prediction probabilities when available

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure your trained model file `best_machine_failure_model.pkl` is in the project directory.

## Running the Server

### Option 1: Using the startup script
```bash
python run_server.py
```

### Option 2: Using uvicorn directly
```bash
uvicorn temp_teller:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Check
- **GET** `/health` - Check API and model status

### Model Information
- **GET** `/model-info` - Get loaded model information

### Single Prediction
- **POST** `/predict` - Predict failure for a single machine

Example request:
```json
{
  "Type": "M",
  "Air_temperature_K": 298.1,
  "Process_temperature_K": 308.6,
  "Rotational_speed_rpm": 1551,
  "Torque_Nm": 42.8,
  "Tool_wear_min": 0
}
```

### Batch Prediction
- **POST** `/batch-predict` - Predict failures for multiple machines

Example request:
```json
{
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
```

## Input Parameters

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| Type | string | L, M, H | Machine type (Low, Medium, High) |
| Air_temperature_K | float | 250-350 | Air temperature in Kelvin |
| Process_temperature_K | float | 300-400 | Process temperature in Kelvin |
| Rotational_speed_rpm | float | 1000-3000 | Rotational speed in RPM |
| Torque_Nm | float | 0-100 | Torque in Newton-meters |
| Tool_wear_min | float | 0-300 | Tool wear in minutes |

## Testing

Run the test client to verify all endpoints:
```bash
python test_client.py
```

## Response Format

### Single Prediction Response
```json
{
  "prediction": 0,
  "probability": 0.15,
  "risk_level": "Low",
  "timestamp": "2024-01-20T10:30:00",
  "input_data": {
    "Type": "M",
    "Air_temperature_K": 298.1,
    "Process_temperature_K": 308.6,
    "Rotational_speed_rpm": 1551,
    "Torque_Nm": 42.8,
    "Tool_wear_min": 0
  }
}
```

### Prediction Values
- **0**: No failure predicted
- **1**: Failure predicted

### Risk Levels
- **Low**: Probability < 0.3
- **Medium**: Probability 0.3-0.7
- **High**: Probability > 0.7

## Error Handling

The API includes comprehensive error handling for:
- Invalid input data
- Model loading failures
- Prediction errors
- Server errors

All errors return appropriate HTTP status codes and descriptive messages.

## Logging

The application logs important events including:
- Model loading status
- Prediction requests
- Errors and warnings

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all origins, making the API accessible from web applications.

## Production Deployment

For production deployment, consider:
- Using a production ASGI server like Gunicorn with Uvicorn workers
- Setting up proper logging configuration
- Implementing authentication and rate limiting
- Using environment variables for configuration
- Setting up monitoring and health checks