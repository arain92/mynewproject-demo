import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { rooms, assignments, users } from '../data/store.js';

function getRoomSummary(room) {
  const assignedCount = assignments.filter(a => a.roomId === room.id).length;
  const availableBeds = Math.max((room.totalBeds || 0) - assignedCount, 0);
  return { ...room, assignedCount, availableBeds };
}

export function listRooms(req, res) {
  const list = rooms.map(r => getRoomSummary(r));
  res.json(list);
}

export function getRoom(req, res) {
  const { id } = req.params;
  const room = rooms.find(r => r.id === id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(getRoomSummary(room));
}

export function createRoom(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { roomNumber, totalBeds, amenities, rent } = req.body;
  const exists = rooms.find(r => r.roomNumber.toLowerCase() === roomNumber.toLowerCase());
  if (exists) return res.status(400).json({ message: 'Room number already exists' });
  const room = { id: uuidv4(), roomNumber, totalBeds, amenities: amenities || [], rent: rent || 0, createdAt: new Date().toISOString() };
  rooms.push(room);
  res.status(201).json(getRoomSummary(room));
}

export function updateRoom(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { id } = req.params;
  const room = rooms.find(r => r.id === id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  const { roomNumber, totalBeds, amenities, rent } = req.body;
  if (roomNumber) {
    const conflict = rooms.find(r => r.roomNumber.toLowerCase() === roomNumber.toLowerCase() && r.id !== id);
    if (conflict) return res.status(400).json({ message: 'Room number already in use' });
    room.roomNumber = roomNumber;
  }
  if (typeof totalBeds === 'number') {
    const assignedCount = assignments.filter(a => a.roomId === id).length;
    if (totalBeds < assignedCount) return res.status(400).json({ message: 'totalBeds cannot be less than assigned students' });
    room.totalBeds = totalBeds;
  }
  if (Array.isArray(amenities)) room.amenities = amenities;
  if (typeof rent === 'number') room.rent = rent;
  res.json(getRoomSummary(room));
}

export function deleteRoom(req, res) {
  const { id } = req.params;
  const roomIndex = rooms.findIndex(r => r.id === id);
  if (roomIndex === -1) return res.status(404).json({ message: 'Room not found' });
  const assignedCount = assignments.filter(a => a.roomId === id).length;
  if (assignedCount > 0) return res.status(400).json({ message: 'Cannot delete a room with assigned students' });
  const [removed] = rooms.splice(roomIndex, 1);
  res.json({ message: 'Room deleted', room: removed });
}

export function assignStudent(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { roomId } = req.params;
  const { studentId, studentEmail } = req.body;
  const room = rooms.find(r => r.id === roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  let student = null;
  if (studentId) student = users.find(u => u.id === studentId);
  if (!student && studentEmail) student = users.find(u => u.email.toLowerCase() === studentEmail.toLowerCase());
  if (!student) return res.status(404).json({ message: 'Student not found' });
  if (student.role !== 'student') return res.status(400).json({ message: 'User is not a student' });

  const alreadyAssigned = assignments.find(a => a.studentId === student.id);
  if (alreadyAssigned) return res.status(400).json({ message: 'Student already assigned to a room' });

  const assignedCount = assignments.filter(a => a.roomId === roomId).length;
  if (assignedCount >= (room.totalBeds || 0)) return res.status(400).json({ message: 'No available beds in this room' });

  const assignment = { id: uuidv4(), roomId, studentId: student.id, assignedAt: new Date().toISOString() };
  assignments.push(assignment);
  res.status(201).json({ message: 'Student assigned', assignment });
}

export function unassignStudent(req, res) {
  const { roomId, studentId } = req.params;
  const idx = assignments.findIndex(a => a.roomId === roomId && a.studentId === studentId);
  if (idx === -1) return res.status(404).json({ message: 'Assignment not found' });
  const [removed] = assignments.splice(idx, 1);
  res.json({ message: 'Student unassigned', assignment: removed });
}