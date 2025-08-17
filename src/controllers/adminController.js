import { getAdminDashboard } from '../data/store.js';

export function getDashboard(req, res) {
  const data = getAdminDashboard();
  res.json(data);
}