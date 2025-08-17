import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { listRooms, getRoom, createRoom, updateRoom, deleteRoom, assignStudent, unassignStudent } from '../controllers/roomController.js';

const router = Router();

router.get('/', authenticate, listRooms);
router.get('/:id', authenticate, getRoom);

router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  [
    body('roomNumber').isString().trim().isLength({ min: 1 }),
    body('totalBeds').isInt({ min: 1 }).toInt(),
    body('amenities').optional().isArray(),
    body('rent').optional().isFloat({ min: 0 }).toFloat()
  ],
  createRoom
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  [
    param('id').isString().isLength({ min: 1 }),
    body('roomNumber').optional().isString().trim().isLength({ min: 1 }),
    body('totalBeds').optional().isInt({ min: 1 }).toInt(),
    body('amenities').optional().isArray(),
    body('rent').optional().isFloat({ min: 0 }).toFloat()
  ],
  updateRoom
);

router.delete('/:id', authenticate, authorizeRoles('admin'), deleteRoom);

router.post(
  '/:roomId/assign',
  authenticate,
  authorizeRoles('admin'),
  [
    param('roomId').isString().isLength({ min: 1 }),
    body('studentId').optional().isString().isLength({ min: 1 }),
    body('studentEmail').optional().isEmail()
  ],
  assignStudent
);

router.delete('/:roomId/unassign/:studentId', authenticate, authorizeRoles('admin'), unassignStudent);

export default router;