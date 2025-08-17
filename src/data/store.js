import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// In-memory data stores
export const users = [];
export const rooms = [];
export const complaints = [];
export const announcements = [];
export const payments = [];
export const assignments = []; // { id, roomId, studentId, assignedAt }

function seedOnce() {
  if (users.length > 0) return;

  const adminId = uuidv4();
  const studentId = uuidv4();

  users.push(
    {
      id: adminId,
      name: 'Admin User',
      email: 'admin@hostel.com',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin'
    },
    {
      id: studentId,
      name: 'John Student',
      email: 'student@hostel.com',
      passwordHash: bcrypt.hashSync('student123', 10),
      role: 'student'
    }
  );

  const roomAId = uuidv4();
  const roomBId = uuidv4();

  rooms.push(
    { id: roomAId, roomNumber: 'A101', totalBeds: 2, amenities: ['fan', 'desk'], rent: 200, createdAt: new Date().toISOString() },
    { id: roomBId, roomNumber: 'B202', totalBeds: 3, amenities: ['ac', 'balcony'], rent: 250, createdAt: new Date().toISOString() }
  );

  // Pre-assign the student to room A101
  assignments.push({ id: uuidv4(), roomId: roomAId, studentId, assignedAt: new Date().toISOString() });

  complaints.push(
    { id: uuidv4(), studentId, title: 'Leaky faucet', description: 'Bathroom sink leaks', status: 'open', createdAt: new Date().toISOString() }
  );

  announcements.push(
    { id: uuidv4(), title: 'Welcome', message: 'Welcome to the hostel!', createdAt: new Date().toISOString() }
  );

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  payments.push(
    { id: uuidv4(), studentId, month: currentMonth, amountDue: 200, amountPaid: 0, status: 'due', createdAt: new Date().toISOString() }
  );
}

seedOnce();

export function getRoomOccupancy(roomId) {
  const assignedCount = assignments.filter(a => a.roomId === roomId).length;
  return {
    assignedCount,
    availableBeds: Math.max(rooms.find(r => r.id === roomId)?.totalBeds || 0 - assignedCount, 0)
  };
}

export function getAdminDashboard() {
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((sum, r) => sum + (r.totalBeds || 0), 0);
  const occupiedBeds = assignments.length;
  const availableBeds = Math.max(totalBeds - occupiedBeds, 0);

  const complaintCounts = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const paymentSummary = payments.reduce((acc, p) => {
    acc.totalDue = (acc.totalDue || 0) + (p.amountDue || 0);
    acc.totalPaid = (acc.totalPaid || 0) + (p.amountPaid || 0);
    return acc;
  }, { totalDue: 0, totalPaid: 0 });

  return { totalRooms, totalBeds, availableBeds, occupiedBeds, complaints: complaintCounts, payments: paymentSummary };
}

export function getStudentDashboard(studentId) {
  const assignment = assignments.find(a => a.studentId === studentId);
  const room = assignment ? rooms.find(r => r.id === assignment.roomId) : null;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const due = payments.find(p => p.studentId === studentId && p.month === currentMonth) || null;
  return {
    room,
    monthlyDue: due,
    announcements
  };
}