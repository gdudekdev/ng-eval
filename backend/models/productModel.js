const { query } = require('../db');

const getProducts = async () => {
  const result = await query('SELECT id, nom, prix, url FROM products ORDER BY id');
  return result.rows;
};

const getProductById = async (id) => {
  const result = await query('SELECT id, nom, prix, url FROM products WHERE id = $1', [id]);
  return result.rows[0];
};

const getRandomProducts = async (count = 4) => {
  const result = await query(
    'SELECT id FROM products ORDER BY RANDOM() LIMIT $1',
    [count]
  );
  return result.rows.map(row => row.id);
};

module.exports = {
  getProducts,
  getProductById,
  getRandomProducts,
};

