# Imagem node
FROM node:20

# Diretório dos arquivos no container
WORKDIR /app

# Atualiza o bcrypt
RUN npm rebuild bcrypt --build-from-source

# Copia os arquivos package*.json ./ para o diretório de arquivo
COPY package*.json ./

# Baixa e instala as dependências
RUN npm install

#RUN npm run build

# Copia todos os arquivos da pasta raiz para a pasta de trabalho no container
COPY . .

# Criando algumas variáveis de ambiente
#ENV MONGODB_INITDB_ROOT_USERNAME=user
#ENV MONGODB_INITDB_ROOT_PASSWORD=pass
#ENV MONGODB_INITDB_DATABASE=projetocompras

# Porta exposta em que a aplicação roda
EXPOSE 3000

# Comando utilizado para iniciar a aplicação
CMD [ "node", "--no-warnings", "app.js" ]