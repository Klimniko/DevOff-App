import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { findUserByUsername, findUserById } from '../models/userModel.js';
import { issueToken, clearToken } from '../middleware/authMiddleware.js';

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Invalid input', errors: errors.array() });
  }

  const { username, password } = req.body;
  const user = await findUserByUsername(username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = issueToken(res, { id: user.id, username: user.username });

  return res.json({
    token,
    user: { id: user.id, username: user.username }
  });
}

export async function logout(req, res) {
  clearToken(res);
  return res.json({ message: 'Logged out successfully' });
}

export async function verify(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const user = await findUserById(req.user.id);
  return res.json({ user });
}
