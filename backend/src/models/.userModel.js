const db = require('../config/db');

const getUserById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );

  return rows[0];
};

const createUser = async (name, email, password) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );

  return result;
};

module.exports = {
  getUserById,
  createUser
};