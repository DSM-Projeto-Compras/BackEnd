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

# Copia todos os arquivos da pasta raiz para a pasta de trabalho no container
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Variáveis de ambiente para MySQL/Prisma
# ENV DATABASE_URL="mysql://user:password@host:port/database"
# ENV DB_HOST="localhost"
# ENV DB_USER="admin"
# ENV DB_PASSWORD="adminfatec"
# ENV DB_NAME="projetoCompras"
# ENV DB_PORT="3306"

# Porta exposta em que a aplicação roda
EXPOSE 4000

# Comando utilizado para iniciar a aplicação
CMD [ "node", "--no-warnings", "app.js" ]
