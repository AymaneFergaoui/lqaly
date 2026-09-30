import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

// Enhanced file validation
const fileFilter = (req, file, cb) => {
    // Check MIME type
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!allowedExtensions.includes(ext)) {
        return cb(new Error('Invalid file extension'), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Reduced from 10MB to 5MB
        files: 10 // Maximum 10 files per upload
    },
});

export default upload;
