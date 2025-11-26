import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectToDatabase, testarConexaoPostgres } from './utils/database.js';
// import { testarConexaoPostgres } from './utils/postgres.js'; //aws

import LoginRoute from './routes/LoginRoute.js';
import productRoutes from './routes/ProductRoute.js';
import logsRoute from './routes/LogsRoute.js';
import BECRoute from './routes/BECRoute.js';
import supplierRoutes from './routes/SupplierRoute.js';
import ChatbotRoute from './routes/ChatbotRoute.js';

import swaggerUI from 'swagger-ui-express'
import swaggerFile  from './swagger/swagger_output.json' with { type: 'json' };

dotenv.config();

const app = express();
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

// Conectar ao Postgres via Prisma
connectToDatabase();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: '*',
}));
app.use(express.json())
app.disable('x-powered-by')


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rotas
app.get('/api', (req, res)=> {
  /* 
 * #swagger.tags = ['Detalhes da API']
 * #swagger.summary = 'Rota default que retorna a versão da API'
 * #swagger.description = 'Endpoint que retorna a versão da API'    
 * #swagger.path = '/'
 * #swagger.method = 'GET'
 */
 res.status(200).json({
     message: 'API Compras FATEC',
     version: '1.0.0'
 })
})

app.get('/postgres/testar-conexao', testarConexaoPostgres);
// app.get('/mysql/testar-conexao', testarConexaoMySQL); //aws

app.use('/api/logins', LoginRoute);
app.use('/api/products', productRoutes);
app.use('/api/logs', logsRoute);
app.use('/api/bec', BECRoute);
app.use('/api/suppliers', supplierRoutes);
app.use("/api/chat", ChatbotRoute);

/* app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./swagger/swagger_output.json')),{customCss:
  '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
customCssUrl: CSS_URL })) */

app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile, {customCss:
  '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
  customCssUrl: CSS_URL
}));

//# Region S3 configurada no BucketController.js
// app.use('/api/buckets', bucketRoute); 

// Iniciar o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});