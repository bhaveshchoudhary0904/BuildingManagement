const db = require('../config/db');

const getAllBuildings = async () => {
  const [rows] = await db.query(
    'SELECT * FROM buildings'
  );

  return rows;
};

module.exports = {
  getAllBuildings
};