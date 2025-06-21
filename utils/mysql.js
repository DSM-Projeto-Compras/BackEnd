import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
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
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

export const testarConexaoMySQL = async (req, res) => {
    try {
        const connection = await getConnection();
        await connection.query(`USE \`${DB_NAME}\``);
        res.status(200).json({ message: 'Conexão com MySQL bem-sucedida' });
        connection.release();
    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', error);
        res.status(500).json({ error: 'Erro ao conectar ao MySQL', details: error.message });
    }
}
