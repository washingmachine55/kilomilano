import express from 'express';
import { getAllUsers, getSingleUser, uploadUserProfilePicture } from '../controllers/users.controller.js';
import { uploadImages } from '../config/multer.js';
const router = express.Router();

router.get('/profile', getSingleUser);
router.get('/', getAllUsers);
router.post('/profile-picture-upload', uploadImages, uploadUserProfilePicture);

export default router;
