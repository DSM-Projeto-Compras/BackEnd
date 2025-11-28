import swaggerAutogen from 'swagger-autogen'

const doc = {
    swagger: "2.0",
    info: {
        version: "3.0.0",
        title: "API Compras Fatec Votorantim"
    },
    host: 'back-end-three-lyart.vercel.app',
    // host: 'localhost:3000',
    basePath: "/",
    schemes: ['https', 'http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        apiKeyAuth:{
            type: "apiKey",
            in: "header",
            name: "access-token",
            description: "Token de Acesso gerado após o login"
        }
    },
    definitions: {
        Erro: {
            value: "Erro gerado pela aplicação",
            msg: "Mensagem detalhando o erro",
            param: "URL que gerou o erro"
        }
    }
}

const outputFile = './swagger/swagger_output.json'
const endpointsFiles = ['./app.js']
const options = {
    swagger: '2.0',          // By default is null
    language: 'pt-BR',         // By default is 'en-US'
    disableLogs: false,     // By default is false
    disableWarnings: false  // By default is false
}

swaggerAutogen(options)(outputFile, endpointsFiles, doc).then(async () => {
    await import('./app.js'); // Your project's root file
  });

// import swaggerJSDoc from 'swagger-jsdoc';
// import fs from 'fs';

// // Gera o arquivo OpenAPI (swagger) a partir de comentários JSDoc (@swagger)
// // Usa os arquivos que possuem comentários: app.js, routes/*.js, controllers/*.js

// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             version: '3.0.0',
//             title: 'API Compras Fatec Votorantim',
//             description: 'Documentação gerada automaticamente via swagger-jsdoc'
//         },
//         servers: [
//             { url: 'https://back-end-three-lyart.vercel.app' },
//             { url: 'http://localhost:4000' }
//         ],
//         components: {
//             securitySchemes: {
//                 bearerAuth: {
//                     type: 'http',
//                     scheme: 'bearer',
//                     bearerFormat: 'JWT',
//                     description: 'Token JWT obtido no login'
//                 }
//             }
//         }
//     },
//     apis: ['./app.js', './routes/*.js', './controllers/*.js']
// };

// const swaggerSpec = swaggerJSDoc(options);
// const outputFile = './swagger/swagger_output.json';
// fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));
// console.log(`Swagger generated at ${outputFile}`);