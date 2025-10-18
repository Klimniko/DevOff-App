import pool from '../config/database.js';

export async function findUserByUsername(username) {
  const [rows] = await pool.execute('SELECT id, username, password FROM users WHERE username = ?', [username]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute('SELECT id, username FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function createUser({ username, password }) {
  const [result] = await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
  return { id: result.insertId, username };
}
