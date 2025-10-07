import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Instância global do Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const connectToDatabase = async () => {
  try {
    // Testa a conexão
    await prisma.$connect();
    console.log('Conectado ao MySQL via Prisma');
  } catch (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    throw err;
  }
};

export const testarConexaoMySQL = async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({ message: 'Conexão com MySQL bem-sucedida' });
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MySQL', details: error });
  }
};

// Função para fechar a conexão (importante para testes e shutdown)
export const disconnectFromDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('Desconectado do MySQL');
  } catch (err) {
    console.error('Erro ao desconectar do MySQL:', err);
  }
};

// Exporta a instância do Prisma para uso nos modelos
export default prisma;
