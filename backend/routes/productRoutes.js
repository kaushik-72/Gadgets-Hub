import {Router} from 'express';
import protect from '../middleware/authmiddleware.js';
import admin from '../middleware/adminmiddleware.js';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController.js';
import multer from 'multer';

const upload =  multer({dest: 'uploads/'})
const router = Router();

router.route('/').get(getProducts).post(protect, admin,upload.single('image'), createProduct);
router.route('/:id').get(getProductById).put(protect, admin,upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);

export default router;