#!/usr/bin/env python3
"""
Startup script for the Machine Failure Prediction API
"""
import uvicorn
import os

if __name__ == "__main__":
    # Check if model file exists
    if not os.path.exists("best_machine_failure_model.pkl"):
        print("Warning: Model file 'best_machine_failure_model.pkl' not found!")
        print("Please ensure the model file is in the current directory.")
    
    # Run the server
    uvicorn.run(
        "temp_teller:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )