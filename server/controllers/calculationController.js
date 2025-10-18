import { validationResult } from 'express-validator';
import {
  createCalculation,
  deleteCalculation,
  findCalculationById,
  listCalculations,
  updateCalculation
} from '../models/calculationModel.js';

export async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Invalid input', errors: errors.array() });
  }

  const payload = req.body;
  const created = await createCalculation(req.user.id, payload);
  const record = await findCalculationById(created.id, req.user.id);
  return res.status(201).json(record);
}

export async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Invalid input', errors: errors.array() });
  }
  const { id } = req.params;
  await updateCalculation(id, req.user.id, req.body);
  const updated = await findCalculationById(id, req.user.id);
  return res.json(updated);
}

export async function remove(req, res) {
  const { id } = req.params;
  await deleteCalculation(id, req.user.id);
  return res.json({ message: 'Calculation deleted' });
}

export async function list(req, res) {
  const data = await listCalculations(req.user.id, req.query);
  return res.json(data);
}

export async function getById(req, res) {
  const { id } = req.params;
  const calculation = await findCalculationById(id, req.user.id);
  if (!calculation) {
    return res.status(404).json({ message: 'Calculation not found' });
  }
  return res.json(calculation);
}
