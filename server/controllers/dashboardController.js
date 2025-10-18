import { getDashboardStats } from '../models/calculationModel.js';

export async function getStats(req, res) {
  const stats = await getDashboardStats(req.user.id);
  res.json(stats);
}
