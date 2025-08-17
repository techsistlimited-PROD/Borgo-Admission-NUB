import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// File filter for security
const fileFilter = (req: any, file: any, cb: any) => {
  // Allow only images and PDFs
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (JPEG, PNG, GIF) and PDF files are allowed.",
      ),
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Single file upload endpoint
export const handleSingleUpload: RequestHandler = (req, res) => {
  const uploadSingle = upload.single("file");

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "File too large. Maximum size is 5MB.",
        });
      }
      return res.status(400).json({
        error: `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded.",
      });
    }

    // Return file information
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: req.file.path,
      },
    });
  });
};

// Multiple files upload endpoint
export const handleMultipleUpload: RequestHandler = (req, res) => {
  const uploadMultiple = upload.array("files", 10); // Max 10 files

  uploadMultiple(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error:
            "One or more files are too large. Maximum size is 5MB per file.",
        });
      }
      return res.status(400).json({
        error: `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        error: "No files uploaded.",
      });
    }

    // Return files information
    const files = (req.files as Express.Multer.File[]).map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      path: file.path,
    }));

    res.json({
      success: true,
      files,
    });
  });
};

// Delete uploaded file endpoint
export const handleDeleteFile: RequestHandler = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required." });
    }

    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found." });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      error: "Failed to delete file.",
    });
  }
};
