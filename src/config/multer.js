import multer from 'multer';
import path from 'path';
import * as fsAsync from 'fs/promises';
import fs from 'fs';

const imagesPath = path.dirname("../public/images/uploads")
const uploadDir = path.join(imagesPath, 'uploads');

if (!fs.existsSync(uploadDir)) {
	await fsAsync.mkdir(uploadDir, { recursive: true });
}

// Configure storage engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, imagesPath); // Specify the local destination folder
	},
	filename: function (req, file, cb) {
		// Generate a unique filename by appending a timestamp and original extension
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	}
});

// Initialize upload middleware with configuration
export const uploadImages = multer({
	storage: storage,
	limits: { fileSize: 2000000 }, // Optional: limit file size to 1MB
	fileFilter: function (req, file, cb) {
		// Optional: Filter file types
		const filetypes = /jpeg|jpg|png|gif/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		if (mimetype && extname) {
			return cb(null, true);
		}
		cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
	}
}).single('file');

