const { query } = require('../db');
const bcrypt = require('bcryptjs');

const getUsers = async () => {
  const result = await query(
    'SELECT id, email, admin, created_at FROM users ORDER BY id'
  );
  return result.rows;
};

const getUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const authenticateUser = async (email, password) => {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  if (user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return null;
};

const createUser = async (userData) => {
  const { email, password, admin } = userData;

  const result = await query(
    'INSERT INTO users (email, password, admin) VALUES ($1, $2, $3) RETURNING id, email, admin, created_at',
    [email, password, admin || false]
  );

  return result.rows[0];
};

module.exports = {
  getUsers,
  getUserByEmail,
  authenticateUser,
  createUser,
};

