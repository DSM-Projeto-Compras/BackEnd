import { pool } from '../utils/mysql.js';

export async function saveLog(log) {
    const { level, message, route, ...extra} = log;
    try{
        await pool.query(`USE \`${process.env.DB_NAME}\``);
        pool.query(
            'INSERT INTO logs (level, message, route, extra) VALUES (?, ?, ?, ?)',
            [level, message, route, JSON.stringify(extra)]
        );
    } catch (error) {
        console.error('Erro ao salvar log:', error);
        res.status(500).send({
            error: 'Erro ao salvar log'
        });
    }
}

export async function getLogs(req, res) {
    try{
        await pool.query(`USE \`${process.env.DB_NAME}\``);
        const [rows] = await pool.query('SELECT * FROM logs ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao obter logs:', error);
        res.status(500).send({
            error: 'Erro ao obter logs'
        });
    }
}

export async function getLogById(req, res) {
    const { id } = req.params;
    try{
        await pool.query(`USE \`${process.env.DB_NAME}\``);
        const [rows] = await pool.query('SELECT * FROM logs WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).send({
                error: 'Log não encontrado'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao obter log:', error);
        res.status(500).send({
            error: 'Erro ao obter log'
        });
    }
}

export async function getLogsByDate(req, res) {
    const {data_inicial, data_final} = req.query;
    try{
        await pool.query(`USE \`${process.env.DB_NAME}\``);
        const [rows] = await pool.query(
            'SELECT * FROM logs WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC',
            [data_inicial, data_final]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao obter logs por data:', error);
        res.status(500).send({
            error: 'Erro ao obter logs por data'
        });
    }
}

export async function deleteLog(req, res) {
    const { id } = req.params;
    try{
        await pool.query(`USE \`${process.env.DB_NAME}\``);
        const [result] = await pool.query('DELETE FROM logs WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({
                error: 'Log não encontrado'
            });
        }
        res.status(200).send({message: 'Log deletado com sucesso'});
    } catch (error) {
        console.error('Erro ao deletar log:', error);
        res.status(500).send({
            error: 'Erro ao deletar log'
        });
    }
}