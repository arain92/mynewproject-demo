import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { payments } from '../data/store.js';

export function listPayments(req, res) {
  if (req.user.role === 'admin') {
    return res.json(payments);
  }
  const mine = payments.filter(p => p.studentId === req.user.id);
  res.json(mine);
}

export function createDue(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { studentId, month, amountDue } = req.body;
  const exists = payments.find(p => p.studentId === studentId && p.month === month);
  if (exists) return res.status(400).json({ message: 'Due already exists for this month' });
  const due = { id: uuidv4(), studentId, month, amountDue, amountPaid: 0, status: 'due', createdAt: new Date().toISOString() };
  payments.push(due);
  res.status(201).json(due);
}

export function markPaid(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { id } = req.params;
  const { amountPaid } = req.body;
  const payment = payments.find(p => p.id === id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  payment.amountPaid = (payment.amountPaid || 0) + amountPaid;
  payment.status = payment.amountPaid >= payment.amountDue ? 'paid' : 'partial';
  payment.updatedAt = new Date().toISOString();
  res.json(payment);
}