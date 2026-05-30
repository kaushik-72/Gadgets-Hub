import {Router} from 'express';
import protect from '../middleware/authmiddleware.js';
import admin from '../middleware/adminmiddleware.js';
import getAdminStats from "../controllers/analyticsController.js";

const router = Router();

router.get('/',protect,admin,getAdminStats);

export default router;