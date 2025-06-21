import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

const DB_NAME = process.env.DB_NAME;

export const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Erro ao obter conexão:', err);
                res.status(500).send('Erro ao obter conexão com o banco de dados');
                reject(err);
            } else {
                resolve(connection);
                res.status(200).send('Conexão com o banco de dados MySQL bem-sucedida');
            }
        });
    });
}
