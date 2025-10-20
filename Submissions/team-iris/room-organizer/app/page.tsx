"use client";

import { CheckCircle, Home, Sparkles, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface OrganizationResult {
  aiDescription: string;
}

export default function RoomOrganizer() {
  const [organizationResult, setOrganizationResult] =
    useState<OrganizationResult | null>(null);
  const [roomType, setRoomType] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setError("");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const organizeRoom = async () => {
    if (!roomType) {
      setError("Please select a room type");
      return;
    }

    setIsProcessing(true);
    setError("");
    setOrganizationResult(null);

    try {
      const response = await fetch("/api/organize-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get organization tips");
      }

      const result = await response.json();

      setOrganizationResult({
        aiDescription: result.aiDescription,
      });
    } catch (err) {
      setError("Failed to organize room. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Home className="w-10 h-10 text-indigo-600" />
            AI Room Organizer
          </h1>
          <p className="text-lg text-gray-600">
            Get AI-powered organization suggestions for any room type
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Select Room Type
            </h2>

            {/* Room Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose the room you want to organize
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select room type...</option>
                <option value="living_room">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="office">Home Office</option>
                <option value="bathroom">Bathroom</option>
                <option value="dining_room">Dining Room</option>
                <option value="garage">Garage</option>
                <option value="closet">Closet/Wardrobe</option>
              </select>
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload a photo of your room (optional)
              </label>
              <div
                {...getRootProps()}
                className={`w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  {isDragActive ? (
                    <p className="text-indigo-600 font-medium">
                      Drop the image here...
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Drag & drop a photo here, or click to select
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, JPEG, WebP up to 10MB
                  </p>
                </div>
              </div>
              {selectedFile && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Selected: {selectedFile.name}
                  </p>
                </div>
              )}
            </div>

            {/* Organize Button */}
            <button
              onClick={organizeRoom}
              disabled={!roomType || isProcessing}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing Room...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get Organization Tips
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              AI Organization Analysis
            </h2>

            {!organizationResult && !isProcessing && (
              <div className="text-center py-12 text-gray-500">
                <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>
                  Select a room type to get AI-powered organization suggestions
                </p>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  AI is analyzing your room type...
                </p>
              </div>
            )}

            {organizationResult && (
              <div className="space-y-6">
                {/* AI Description */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    AI Analysis for {roomType.replace("_", " ")}
                  </h3>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {organizationResult.aiDescription}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                1. Choose Room Type
              </h3>
              <p className="text-gray-600">
                Select the type of room you want to organize
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. AI Processing</h3>
              <p className="text-gray-600">
                Google Gemini AI analyzes typical organization challenges
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Get AI Response</h3>
              <p className="text-gray-600">
                Receive detailed AI-powered organization analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
