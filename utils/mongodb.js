import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
    throw new Error(
        'Por favor, defina a variável de ambiente MONGODB_URI dentro do arquivo .env'
    );
}

if (!MONGODB_DB) {
    throw new Error(
        'Por favor, defina a variável de ambiente MONGODB_DB dentro do arquivo .env'
    );
}

export const connectToDatabase = async () => {
    try {
        const uri = `${MONGODB_URI.replace(/\/$/, '')}/${MONGODB_DB}`;
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado ao MongoDB');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB', err);
        throw err;
    }
};

export const testarConexaoMongo = async (req, res) => {
    try {
        await connectToDatabase();
        res.status(200).json({ message: 'Conexão com MongoDB bem-sucedida' });
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        res.status(500).json({ error: 'Erro ao conectar ao MongoDB', details: error });
    }
}