import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { getDashboard } from '../controllers/adminController.js';

const router = Router();

router.get('/dashboard', authenticate, authorizeRoles('admin'), getDashboard);

export default router;