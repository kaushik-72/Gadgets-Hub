import {Router} from 'express';
import protect from '../middleware/authmiddleware';
import admin from '../middleware/adminmiddleware';
import getAdminStats from "../controllers/analyticsController.js";

const router = Router();

router.get('/',protect,admin,getAdminStats);

export default router;