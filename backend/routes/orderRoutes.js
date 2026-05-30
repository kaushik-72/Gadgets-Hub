import {Router} from 'express';
import protect from '../middleware/authmiddleware.js';
import admin from '../middleware/adminmiddleware.js';
import { addOrderItems, getMyOrders, getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;