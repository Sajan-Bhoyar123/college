import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();



export const databasePool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function ensureDatabaseConnection() {
  const connection = await databasePool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

export async function initializeSchema() {
  await databasePool.query(`
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      UNIQUE KEY uq_school_name_addr (name, address),
      INDEX idx_schools_lat (latitude),
      INDEX idx_schools_lon (longitude)
    )
  `);

  const [rows] = await databasePool.query('SELECT COUNT(*) AS count FROM schools');
  if (rows[0]?.count === 0) {
    await databasePool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)',
      [
        'Alpha Public School', 'Main Street 1', 28.6139, 77.2090,
        'Beta International', 'Second Avenue 22', 19.0760, 72.8777,
        'Gamma High', 'Third Road 5', 13.0827, 80.2707,
      ]
    );
  }
}
