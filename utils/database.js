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
    console.log('Conectado ao Postgres via Prisma');
  } catch (err) {
    console.error('Erro ao conectar ao Postgres:', err);
    throw err;
  }
};

export const testarConexaoPostgres = async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({ message: 'Conexão com Postgres bem-sucedida' });
  } catch (error) {
    console.error('Erro ao conectar ao Postgres:', error);
    res.status(500).json({ error: 'Erro ao conectar ao Postgres', details: error });
  }
};

// Função para fechar a conexão (importante para testes e shutdown)
export const disconnectFromDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('Desconectado do Postgres');
  } catch (err) {
    console.error('Erro ao desconectar do Postgres:', err);
  }
};

// Exporta a instância do Prisma para uso nos modelos
export default prisma;
