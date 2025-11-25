# Imagem node
FROM node:20

# Diretório dos arquivos no container
WORKDIR /app

# Copia os arquivos package*.json ./ para o diretório de arquivo
COPY package*.json ./

# Copia a pasta prisma antes da instalação das dependências
COPY prisma ./prisma

# Baixa e instala as dependências
RUN npm install

# Atualiza o bcrypt
RUN npm rebuild bcrypt --build-from-source

# Copia todos os arquivos da pasta raiz para a pasta de trabalho no container
COPY . .

# Debug do conteúdo do schema.prisma
RUN cat prisma/schema.prisma

# Gera o cliente Prisma
RUN npx prisma generate

# Debug pós-geração
RUN cat prisma/schema.prisma

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
