const db = require('../config/db');

const createPayment = async (amount, residentId) => {
  const [result] = await db.query(
    'INSERT INTO payments (amount, resident_id) VALUES (?, ?)',
    [amount, residentId]
  );

  return result;
};

module.exports = {
  createPayment
};