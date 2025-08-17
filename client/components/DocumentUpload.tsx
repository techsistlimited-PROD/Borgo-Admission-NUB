import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface DocumentUploadProps {
  onDocumentUploaded: (documentUrl: string, fileName: string) => void;
  currentDocument?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  label?: string;
  required?: boolean;
  documentType?: string; // For API identification
}

export default function DocumentUpload({
  onDocumentUploaded,
  currentDocument,
  maxSize = 5,
  acceptedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
  label = "Upload Document",
  required = false,
  documentType = "general",
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError("");

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(
        `Please upload a valid file (${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(", ")})`
      );
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size should be less than ${maxSize}MB`);
      return;
    }

    setFileName(file.name);
    await uploadDocument(file);
  };

  const uploadDocument = async (file: File): Promise<void> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      if (data.success) {
        onDocumentUploaded(data.data.url, file.name);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
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

  const handleRemoveDocument = () => {
    onDocumentUploaded("", "");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : currentDocument
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {currentDocument ? (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 truncate">
                  {fileName || "Document uploaded"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click to replace
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveDocument();
              }}
              className="flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop your document here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(", ")} (Max {maxSize}MB)
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center w-full px-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-xs text-gray-600 mb-2">Uploading...</p>
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
