import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { announcements } from '../data/store.js';

export function listAnnouncements(req, res) {
  res.json(announcements);
}

export function createAnnouncement(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, message } = req.body;
  const ann = { id: uuidv4(), title, message, createdAt: new Date().toISOString() };
  announcements.push(ann);
  res.status(201).json(ann);
}

export function deleteAnnouncement(req, res) {
  const { id } = req.params;
  const idx = announcements.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Announcement not found' });
  const [removed] = announcements.splice(idx, 1);
  res.json({ message: 'Deleted', announcement: removed });
}