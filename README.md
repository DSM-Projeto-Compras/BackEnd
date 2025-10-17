# 🛒 Projeto Compras FATEC - Backend

![npm](https://img.shields.io/badge/npm-v11.3.0-red?logo=npm)
![express](https://img.shields.io/badge/express-v4.21.0-darkgreen?logo=express)
![prisma](https://img.shields.io/badge/prisma-v6.16.2-purple?logo=prisma)
![Jest](https://img.shields.io/badge/jest-v29.7.0-green?logo=jest)
![docker](https://img.shields.io/badge/docker-v28.3.0-blue?logo=docker)

API RESTful desenvolvida em Node.js com Express, utilizando MySQL como banco de dados e Prisma como ORM.

## 🚀 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env-example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do MySQL para Prisma
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"

# Configurações alternativas do MySQL (para compatibilidade)
DB_HOST="localhost"
DB_USER="seu_usuario"
DB_PASSWORD="sua_senha"
DB_NAME="nome_do_banco"
DB_PORT="3306"

# Outras configurações
PORT=3000
SECRET_KEY="sua_chave_secreta"
EXPIRES_IN=24h
```

### 3. Configurar Banco de Dados Local

#### Opção A: MySQL Local

1. Instale o MySQL no seu sistema
2. Crie um banco de dados:

```sql
CREATE DATABASE projetoCompras;
```

#### Opção B: Docker (Recomendado)

```bash
# Criar container MySQL
docker run --name mysql-compras \
  -e MYSQL_ROOT_PASSWORD=adminfatec \
  -e MYSQL_DATABASE=projetoCompras \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=adminfatec \
  -p 3306:3306 \
  -d mysql:8.0
```

## 🗄️ Prisma ORM - Guia Completo

### Comandos Principais

#### 1. Gerar Cliente Prisma

```bash
npm run db:generate
# ou
npx prisma generate
```

**Quando usar:** Sempre após alterar o `schema.prisma` ou instalar dependências.

#### 2. Sincronizar Schema com Banco (DB Push)

```bash
npm run db:push
# ou
npx prisma db push
```

**Quando usar:** Para aplicar mudanças do schema diretamente no banco (desenvolvimento).

#### 3. Visualizar Banco (Prisma Studio)

```bash
npm run db:studio
# ou
npx prisma studio
```

**Quando usar:** Para visualizar e editar dados do banco através de interface web.

#### 4. Reset do Banco

```bash
npm run db:reset
# ou
npx prisma migrate reset
```

**Quando usar:** Para limpar completamente o banco e recriar tudo do zero.

### Fluxo de Trabalho com Prisma

#### 🔄 **Desenvolvimento Diário:**

```bash
# 1. Fazer alterações no schema.prisma
# 2. Aplicar mudanças no banco
npm run db:push

# 3. Gerar cliente (se necessário)
npm run db:generate

# 4. Visualizar dados (opcional)
npm run db:studio
```

#### 🆕 **Nova Instalação:**

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
cp .env-example .env

# 3. Aplicar schema no banco
npm run db:push

# 4. Iniciar aplicação
npm run dev
```

## 🏃‍♂️ Executando a Aplicação

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

### Testes

```bash
npm test
```

## 📚 Estrutura do Projeto

```
BackEnd/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── controllers/               # Controladores da API
├── models/                    # Modelos (Prisma)
├── routes/                    # Rotas da API
├── middlewares/              # Middlewares
├── utils/
│   └── database.js           # Conexão com Prisma
├── __tests__/                # Testes
└── swagger/                  # Documentação da API
```

## 🔧 Comandos Úteis

### Prisma

```bash
# Ver status do banco
npx prisma db pull

# Validar schema
npx prisma validate

# Formatar schema
npx prisma format
```

### Desenvolvimento

```bash
# Gerar documentação Swagger
npm run doc

# Ver logs em tempo real
npm run dev
```

## 🐛 Solução de Problemas

### Erro de Conexão com Banco

1. Verifique se o MySQL está rodando
2. Confirme as credenciais no `.env`
3. Teste a conexão:

```bash
npm run db:studio
```

### Schema não sincronizado

```bash
# Força sincronização
npm run db:push --force-reset
```

### Cliente Prisma desatualizado

```bash
# Regenera cliente
npm run db:generate
```

## 📖 Documentação da API

Após iniciar a aplicação, acesse:

- **Swagger UI:** `http://localhost:3000/api/doc`
- **API Base:** `http://localhost:3000/api`

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
DATABASE_URL="mysql://usuario:senha@host:porta/banco"
NODE_ENV=production
PORT=3000
```

### Comandos de Deploy

```bash
# 1. Instalar dependências
npm ci --production

# 2. Gerar cliente Prisma
npm run db:generate

# 3. Aplicar schema no banco
npm run db:push

# 4. Iniciar aplicação
npm start
```

---

## 📝 Notas Importantes

- ⚠️ **Este projeto usa `db push` ao invés de migrations**
- 🔄 **Sempre execute `db:generate` após alterar o schema**
- 🗄️ **Use `db:studio` para visualizar dados durante desenvolvimento**
- 🚫 **NÃO use `prisma migrate` - use apenas `db push`**

## 🤝 Contribuição

1. Faça suas alterações no `schema.prisma`
2. Execute `npm run db:push`
3. Teste suas mudanças
4. Faça commit das alterações
