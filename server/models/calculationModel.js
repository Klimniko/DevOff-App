import pool from '../config/database.js';

const numericFields = [
  'buying_price_usd',
  'selling_price_eur',
  'exchange_rate',
  'commission_eur',
  'working_days'
];

function normalizeCalculation(row) {
  if (!row) return null;
  const normalized = { ...row };
  numericFields.forEach((field) => {
    if (field in normalized && normalized[field] !== null && normalized[field] !== undefined) {
      normalized[field] = Number(normalized[field]);
    }
  });
  return normalized;
}

export async function createCalculation(userId, payload) {
  const {
    project_name,
    project_description,
    buying_price_usd,
    selling_price_eur,
    exchange_rate,
    commission_eur,
    working_days,
    calculation_date
  } = payload;

  const [result] = await pool.execute(
    `INSERT INTO calculations
    (user_id, project_name, project_description, buying_price_usd, selling_price_eur, exchange_rate, commission_eur, working_days, calculation_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, project_name, project_description, buying_price_usd, selling_price_eur, exchange_rate, commission_eur, working_days, calculation_date]
  );

  return { id: result.insertId, ...payload };
}

export async function updateCalculation(id, userId, payload) {
  const fields = [
    payload.project_name,
    payload.project_description,
    payload.buying_price_usd,
    payload.selling_price_eur,
    payload.exchange_rate,
    payload.commission_eur,
    payload.working_days,
    payload.calculation_date,
    id,
    userId
  ];

  const [result] = await pool.execute(
    `UPDATE calculations
     SET project_name = ?, project_description = ?, buying_price_usd = ?, selling_price_eur = ?, exchange_rate = ?, commission_eur = ?, working_days = ?, calculation_date = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`,
    fields
  );

  return result.affectedRows;
}

export async function deleteCalculation(id, userId) {
  const [result] = await pool.execute('DELETE FROM calculations WHERE id = ? AND user_id = ?', [id, userId]);
  return result.affectedRows;
}

export async function findCalculationById(id, userId) {
  const [rows] = await pool.execute('SELECT * FROM calculations WHERE id = ? AND user_id = ?', [id, userId]);
  return normalizeCalculation(rows[0] || null);
}

export async function listCalculations(userId, { page = 1, pageSize = 10, search, startDate, endDate, sortBy = 'calculation_date', sortOrder = 'desc' }) {
  const validSortColumns = ['calculation_date', 'commission_eur', 'project_name'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'calculation_date';
  const order = sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const offset = (page - 1) * pageSize;
  const params = [userId];
  const conditions = ['user_id = ?'];

  if (search) {
    conditions.push('project_name LIKE ?');
    params.push(`%${search}%`);
  }

  if (startDate) {
    conditions.push('calculation_date >= ?');
    params.push(startDate);
  }

  if (endDate) {
    conditions.push('calculation_date <= ?');
    params.push(endDate);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.execute(
    `SELECT * FROM calculations ${whereClause} ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`,
    [...params, Number(pageSize), offset]
  );

  const [[{ total }]] = await pool.execute(`SELECT COUNT(*) AS total FROM calculations ${whereClause}`, params);

  return { items: rows.map(normalizeCalculation), total: Number(total) };
}

export async function getDashboardStats(userId) {
  const [[{ totalCommission }]] = await pool.execute('SELECT COALESCE(SUM(commission_eur),0) AS totalCommission FROM calculations WHERE user_id = ?', [userId]);
  const [[{ averageCommission }]] = await pool.execute('SELECT COALESCE(AVG(commission_eur),0) AS averageCommission FROM calculations WHERE user_id = ?', [userId]);
  const [[{ totalProjects }]] = await pool.execute('SELECT COUNT(*) AS totalProjects FROM calculations WHERE user_id = ?', [userId]);
  const [recent] = await pool.execute('SELECT * FROM calculations WHERE user_id = ? ORDER BY calculation_date DESC LIMIT 10', [userId]);
  const [[topCommission]] = await pool.execute(
    'SELECT * FROM calculations WHERE user_id = ? ORDER BY commission_eur DESC LIMIT 1',
    [userId]
  );
  const [[lastCalculation]] = await pool.execute(
    'SELECT * FROM calculations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
    [userId]
  );

  return {
    totalCommission: Number(totalCommission),
    averageCommission: Number(averageCommission),
    totalProjects: Number(totalProjects),
    recent: recent.map(normalizeCalculation),
    topCommission: normalizeCalculation(topCommission || null),
    lastCalculation: normalizeCalculation(lastCalculation || null)
  };
}

export { normalizeCalculation };
