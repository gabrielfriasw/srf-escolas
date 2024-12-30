import mysql from 'mysql2/promise';

export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'srf_database'
};

export const createConnection = async () => {
  return await mysql.createConnection(dbConfig);
};