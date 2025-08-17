import { useState, useRef } from "react";
import {
  Upload,
  Camera,
  X,
  RotateCw,
  Move,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  label?: string;
  required?: boolean;
}

export default function ImageUpload({
  onImageUploaded,
  currentImage,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png"],
  label = "Upload Photo",
  required = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError("");

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(
        `Please upload a valid image file (${acceptedTypes.join(", ")})`,
      );
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size should be less than ${maxSize}MB`);
      return;
    }

    try {
      // Upload file directly
      const uploadedUrl = await uploadFile(file);
      onImageUploaded(uploadedUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload image. Please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/single', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setIsUploading(false);
      return result.file.url;
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  };

  const handleCropComplete = async () => {
    if (selectedImage) {
      try {
        // For simplicity, we'll use the selected image directly
        // In a real implementation, you would get the cropped image data
        onImageUploaded(selectedImage);
        setShowCropper(false);
        setSelectedImage(null);
      } catch (error) {
        setError("Failed to process image. Please try again.");
      }
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : currentImage
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {currentImage ? (
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-green-300">
              <img
                src={currentImage}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">
                  Image uploaded successfully
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Click to change image
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(currentImage);
                  setShowCropper(true);
                }}
              >
                <RotateCw className="w-4 h-4 mr-1" />
                Crop/Rotate
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop your photo here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPG, PNG (Max {maxSize}MB)
              </p>
            </div>
            <Button className="mt-4" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Image Cropper Modal */}
      <Dialog open={showCropper} onOpenChange={setShowCropper}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Your Photo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />

                {/* Crop overlay - simplified for demo */}
                <div className="absolute inset-4 border-2 border-white border-dashed pointer-events-none"></div>
              </div>
            )}

            {/* Crop Controls */}
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="sm">
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Move className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCropCancel}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-deep-plum hover:bg-accent-purple"
                onClick={handleCropComplete}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save Photo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
