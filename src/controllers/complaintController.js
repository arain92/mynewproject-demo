import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { complaints } from '../data/store.js';

export function listComplaints(req, res) {
  if (req.user.role === 'admin') {
    return res.json(complaints);
  }
  const mine = complaints.filter(c => c.studentId === req.user.id);
  res.json(mine);
}

export function createComplaint(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, description } = req.body;
  const complaint = { id: uuidv4(), studentId: req.user.id, title, description, status: 'open', createdAt: new Date().toISOString() };
  complaints.push(complaint);
  res.status(201).json(complaint);
}

export function updateComplaintStatus(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { id } = req.params;
  const { status } = req.body;
  const complaint = complaints.find(c => c.id === id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();
  res.json(complaint);
}