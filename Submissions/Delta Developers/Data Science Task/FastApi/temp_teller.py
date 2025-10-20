from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
import pickle
import numpy as np
import logging
from datetime import datetime
from typing import List, Optional
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app with comprehensive metadata
app = FastAPI(
    title="Machine Failure Prediction API",
    description="A comprehensive API for predicting machine failures using ML models",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
model = None
model_info = {}

# Load trained model with error handling
def load_model():
    global model, model_info
    try:
        model_path = "best_machine_failure_model.pkl"
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file {model_path} not found")
        
        with open(model_path, "rb") as file:
            model = pickle.load(file)
        
        model_info = {
            "model_loaded": True,
            "model_path": model_path,
            "loaded_at": datetime.now().isoformat(),
            "model_type": str(type(model).__name__)
        }
        logger.info(f"Model loaded successfully: {model_info}")
        
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        model_info = {
            "model_loaded": False,
            "error": str(e),
            "loaded_at": datetime.now().isoformat()
        }
        raise

# Load model on startup
@app.on_event("startup")
async def startup_event():
    load_model()

# Define input data structure with validation
class MachineData(BaseModel):
    Type: str = Field(..., description="Machine type (L, M, or H)")
    Air_temperature_K: float = Field(..., ge=250, le=350, description="Air temperature in Kelvin")
    Process_temperature_K: float = Field(..., ge=300, le=400, description="Process temperature in Kelvin")
    Rotational_speed_rpm: float = Field(..., ge=1000, le=3000, description="Rotational speed in RPM")
    Torque_Nm: float = Field(..., ge=0, le=100, description="Torque in Nm")
    Tool_wear_min: float = Field(..., ge=0, le=300, description="Tool wear in minutes")
    
    @validator('Type')
    def validate_type(cls, v):
        if v.upper() not in ['L', 'M', 'H']:
            raise ValueError('Type must be L, M, or H')
        return v.upper()
    
    class Config:
        schema_extra = {
            "example": {
                "Type": "M",
                "Air_temperature_K": 298.1,
                "Process_temperature_K": 308.6,
                "Rotational_speed_rpm": 1551,
                "Torque_Nm": 42.8,
                "Tool_wear_min": 0
            }
        }

# Response models
class PredictionResponse(BaseModel):
    prediction: int = Field(..., description="Prediction result (0: No failure, 1: Failure)")
    probability: Optional[float] = Field(None, description="Prediction probability if available")
    risk_level: str = Field(..., description="Risk level assessment")
    timestamp: str = Field(..., description="Prediction timestamp")
    input_data: MachineData = Field(..., description="Input data used for prediction")

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    model_info: dict

class BatchPredictionRequest(BaseModel):
    machines: List[MachineData] = Field(..., description="List of machine data for batch prediction")

# Root endpoint
@app.get("/", tags=["General"])
def read_root():
    return {
        "message": "Welcome to Machine Failure Prediction API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "predict": "/predict",
            "batch_predict": "/batch-predict",
            "model_info": "/model-info"
        }
    }

# Health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    return HealthResponse(
        status="healthy" if model is not None else "unhealthy",
        timestamp=datetime.now().isoformat(),
        model_info=model_info
    )

# Model information endpoint
@app.get("/model-info", tags=["Model"])
def get_model_info():
    if not model:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded"
        )
    return model_info

# Single prediction endpoint
@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_failure(data: MachineData):
    if not model:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded. Please check /health endpoint."
        )
    
    try:
        # Convert categorical 'Type' into numerical
        type_map = {"L": 0, "M": 1, "H": 2}
        machine_type = type_map.get(data.Type.upper(), 0)
        
        # Arrange features in correct order for model input
        features = np.array([
            machine_type,
            data.Air_temperature_K,
            data.Process_temperature_K,
            data.Rotational_speed_rpm,
            data.Torque_Nm,
            data.Tool_wear_min
        ]).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Try to get probability if model supports it
        probability = None
        try:
            if hasattr(model, 'predict_proba'):
                prob_array = model.predict_proba(features)[0]
                probability = float(prob_array[1]) if len(prob_array) > 1 else None
        except Exception as e:
            logger.warning(f"Could not get prediction probability: {e}")
        
        # Determine risk level
        if probability is not None:
            if probability < 0.3:
                risk_level = "Low"
            elif probability < 0.7:
                risk_level = "Medium"
            else:
                risk_level = "High"
        else:
            risk_level = "High" if prediction == 1 else "Low"
        
        logger.info(f"Prediction made: {prediction}, Risk: {risk_level}")
        
        return PredictionResponse(
            prediction=int(prediction),
            probability=probability,
            risk_level=risk_level,
            timestamp=datetime.now().isoformat(),
            input_data=data
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

# Batch prediction endpoint
@app.post("/batch-predict", tags=["Prediction"])
def batch_predict(request: BatchPredictionRequest):
    if not model:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded. Please check /health endpoint."
        )
    
    if len(request.machines) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batch size cannot exceed 100 machines"
        )
    
    try:
        results = []
        for machine_data in request.machines:
            # Reuse the single prediction logic
            prediction_result = predict_failure(machine_data)
            results.append(prediction_result)
        
        return {
            "batch_size": len(request.machines),
            "timestamp": datetime.now().isoformat(),
            "predictions": results
        }
        
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch prediction failed: {str(e)}"
        )

# Exception handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": f"Invalid input: {str(exc)}"}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
