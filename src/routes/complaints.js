import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { listComplaints, createComplaint, updateComplaintStatus } from '../controllers/complaintController.js';

const router = Router();

router.get('/', authenticate, listComplaints);

router.post(
  '/',
  authenticate,
  authorizeRoles('student'),
  [
    body('title').isString().trim().isLength({ min: 3 }),
    body('description').isString().trim().isLength({ min: 5 })
  ],
  createComplaint
);

router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('admin'),
  [
    param('id').isString().isLength({ min: 1 }),
    body('status').isIn(['open', 'in_progress', 'resolved']).withMessage('Invalid status')
  ],
  updateComplaintStatus
);

export default router;