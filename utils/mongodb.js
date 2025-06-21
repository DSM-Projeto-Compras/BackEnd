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
        // Remover barra final, se existir, em MONGODB_URI para evitar duplicidade de barras
        const uri = `${MONGODB_URI.replace(/\/$/, '')}/${MONGODB_DB}`;
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado ao MongoDB');
        res.status(200).send('Conexão com o MongoDB bem-sucedida!');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB', err);
        res.status(500).send('Erro na conexão com o MongoDB');
        process.exit(1);
    } finally {
        mongoose.connection.close();
    }
};
