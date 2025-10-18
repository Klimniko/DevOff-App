import {
  createCalculation,
  deleteCalculation,
  findCalculationById,
  listCalculations,
  updateCalculation
} from '../models/calculationModel.js';

function normalizePayload(payload) {
  const buying = Number.parseFloat(payload.buying_price_usd);
  const selling = Number.parseFloat(payload.selling_price_eur);
  const rate = Number.parseFloat(payload.exchange_rate);
  const workingDays = Number.parseInt(payload.working_days, 10);
  const projectName = typeof payload.project_name === 'string' ? payload.project_name.trim() : '';
  const projectDescription =
    typeof payload.project_description === 'string' ? payload.project_description.trim() : null;

  if (!projectName) {
    const error = new Error('Project name is required');
    error.status = 422;
    throw error;
  }

  if (
    ![buying, selling, rate].every(Number.isFinite) ||
    !Number.isFinite(workingDays) ||
    workingDays < 1
  ) {
    const error = new Error('Invalid numeric values provided');
    error.status = 422;
    throw error;
  }

  const calculationDate = new Date(payload.calculation_date);
  if (Number.isNaN(calculationDate.getTime())) {
    const error = new Error('Invalid calculation date provided');
    error.status = 422;
    throw error;
  }

  const commission = Number.parseFloat((selling - buying * rate).toFixed(2));

  return {
    project_name: projectName,
    project_description: projectDescription || null,
    buying_price_usd: buying,
    selling_price_eur: selling,
    exchange_rate: rate,
    working_days: workingDays,
    calculation_date: calculationDate.toISOString().slice(0, 10),
    commission_eur: commission
  };
}

export async function create(req, res) {
  const payload = normalizePayload(req.body);
  const created = await createCalculation(req.user.id, payload);
  const record = await findCalculationById(created.id, req.user.id);
  return res.status(201).json(record);
}

export async function update(req, res) {
  const { id } = req.params;
  const payload = normalizePayload(req.body);
  const affected = await updateCalculation(id, req.user.id, payload);
  if (!affected) {
    return res.status(404).json({ message: 'Calculation not found' });
  }
  const updated = await findCalculationById(id, req.user.id);
  return res.json(updated);
}

export async function remove(req, res) {
  const { id } = req.params;
  const removed = await deleteCalculation(id, req.user.id);
  if (!removed) {
    return res.status(404).json({ message: 'Calculation not found' });
  }
  return res.json({ message: 'Calculation deleted' });
}

export async function list(req, res) {
  const {
    page = '1',
    pageSize = '10',
    search,
    startDate,
    endDate,
    sortBy,
    sortOrder
  } = req.query;

  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedPageSize = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100);

  const data = await listCalculations(req.user.id, {
    page: parsedPage,
    pageSize: parsedPageSize,
    search,
    startDate,
    endDate,
    sortBy,
    sortOrder
  });
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
