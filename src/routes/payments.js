import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { listPayments, createDue, markPaid } from '../controllers/paymentController.js';

const router = Router();

router.get('/', authenticate, listPayments);

router.post(
  '/due',
  authenticate,
  authorizeRoles('admin'),
  [
    body('studentId').isString().isLength({ min: 1 }),
    body('month').matches(/^\d{4}-\d{2}$/).withMessage('Month must be YYYY-MM'),
    body('amountDue').isFloat({ min: 0 }).toFloat()
  ],
  createDue
);

router.patch(
  '/:id/pay',
  authenticate,
  authorizeRoles('admin'),
  [
    param('id').isString().isLength({ min: 1 }),
    body('amountPaid').isFloat({ gt: 0 }).toFloat()
  ],
  markPaid
);

export default router;