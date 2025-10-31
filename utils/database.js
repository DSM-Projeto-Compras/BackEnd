import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Instância global do Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Debug do ambiente
console.log('Database URL format:', process.env.DATABASE_URL?.split(':')[0] || 'not set');
console.log('Prisma Schema Path:', process.env.PRISMA_SCHEMA_PATH || 'default');

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
    res.status(200).json({ message: 'Conexão com o banco de dados bem-sucedida' });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    // Log more detailed error information
    const errorDetails = {
      code: error.code,
      message: error.message,
      meta: error.meta,
      clientVersion: error.clientVersion
    };
    res.status(500).json({ 
      error: 'Erro ao conectar ao banco de dados', 
      details: errorDetails,
      connectionUrl: process.env.DATABASE_URL ? 'Configurado' : 'Não configurado'
    });
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
