import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { listAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';

const router = Router();

router.get('/', authenticate, listAnnouncements);

router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  [
    body('title').isString().trim().isLength({ min: 3 }),
    body('message').isString().trim().isLength({ min: 3 })
  ],
  createAnnouncement
);

router.delete('/:id', authenticate, authorizeRoles('admin'), deleteAnnouncement);

export default router;