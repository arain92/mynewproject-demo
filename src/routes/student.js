import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { getDashboard } from '../controllers/studentController.js';

const router = Router();

router.get('/dashboard', authenticate, authorizeRoles('student'), getDashboard);

export default router;