import { getStudentDashboard } from '../data/store.js';

export function getDashboard(req, res) {
  const data = getStudentDashboard(req.user.id);
  res.json(data);
}