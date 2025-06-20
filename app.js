import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/mongodb.js';
import LoginRoute from './routes/LoginRoute.js';
import productRoutes from './routes/ProductRoute.js';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express'
import swaggerFile  from './swagger/swagger_output.json' with { type: 'json' };

import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { logInfo, logError } from './logger.js';

dotenv.config();

const app = express();
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

// Conectar ao MongoDB
connectToDatabase();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: '*',
}));
app.use(express.json())
app.disable('x-powered-by')

//Logger para AWS CloudWatch


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

app.use('/api/logins', LoginRoute);
app.use('/api/products', productRoutes);

/* app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./swagger/swagger_output.json')),{customCss:
  '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
customCssUrl: CSS_URL })) */

app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile, {customCss:
  '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
  customCssUrl: CSS_URL
}));

// Iniciar o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});