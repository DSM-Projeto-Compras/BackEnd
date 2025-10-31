# 🚀 Feature: BEC Web Scraping

## 📌 Resumo

Feature completa para integração com a Bolsa Eletrônica de Compras de São Paulo (BEC) através de web scraping estruturado.

## 🎯 Objetivo

Permitir que usuários do sistema busquem e consultem produtos do catálogo BEC de forma programática, facilitando a criação de requisições de compra com dados padronizados do governo.

## 📂 Arquivos Criados/Modificados

### Novos Arquivos

```
controllers/
  └── BECController.js          # Controller com lógica de web scraping

validators/
  └── BECValidator.js           # Validações para rotas BEC

routes/
  └── BECRoute.js               # Definição de rotas

http/
  └── bec.http                  # Arquivo de testes HTTP

docs/
  └── BEC_API.md                # Documentação completa da API
```

### Arquivos Modificados

```
app.js                          # Adicionada importação e rota /api/bec
package.json                    # Adicionada dependência 'cheerio'
```

## 🔧 Melhorias Implementadas

### ✅ Comparado à versão anterior

1. **Parsing HTML Robusto**

   - ❌ Antes: Regex para extrair dados
   - ✅ Agora: Cheerio (jQuery-like) para parsing estruturado

2. **Validação de Entrada**

   - ❌ Antes: Validação manual no controller
   - ✅ Agora: Express Validator com regras específicas

3. **Tratamento de Erros**

   - ❌ Antes: Erros genéricos
   - ✅ Agora: Logs estruturados com console.error

4. **Resposta Estruturada**

   - ❌ Antes: Retornava HTML bruto
   - ✅ Agora: Retorna JSON estruturado + HTML opcional

5. **Headers HTTP**

   - ❌ Antes: Headers mínimos
   - ✅ Agora: User-Agent para evitar bloqueios

6. **Documentação**
   - ❌ Antes: Comentários básicos
   - ✅ Agora: Swagger + Markdown detalhado

## 📊 Endpoints Disponíveis

| Método | Endpoint                   | Descrição                       |
| ------ | -------------------------- | ------------------------------- |
| POST   | `/api/bec/products`        | Autocomplete de produtos        |
| POST   | `/api/bec/search`          | Buscar produto por descrição    |
| GET    | `/api/bec/product/:cod_id` | Detalhes de um produto          |
| POST   | `/api/bec/search-details`  | Busca + detalhes (combinado) ⭐ |

## 🧪 Como Testar

### 1. Via REST Client (VS Code)

Abra o arquivo `http/bec.http` e clique em "Send Request" em cada bloco.

**Não esqueça de:**

1. Fazer login primeiro em `http/login.http`
2. Copiar o token recebido
3. Substituir `@accessToken` no arquivo `bec.http`

### 2. Via cURL

```bash
# 1. Fazer login
curl -X POST http://localhost:4000/api/logins/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","senha":"suasenha"}'

# 2. Usar o token nas requisições BEC
curl -X POST http://localhost:4000/api/bec/search-details \
  -H "Content-Type: application/json" \
  -H "access-token: SEU_TOKEN_AQUI" \
  -d '{"description":"cadeira"}'
```

### 3. Via Swagger UI

Acesse: `http://localhost:4000/api/doc`

1. Clique em "Authorize"
2. Cole seu token JWT
3. Navegue até a seção "BEC - Web Scraping"
4. Teste os endpoints

## 📈 Casos de Uso

### Caso 1: Autocomplete em Formulário de Requisição

```javascript
// Frontend
const handleInputChange = async (texto) => {
  if (texto.length < 2) return;

  const response = await fetch("/api/bec/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("token"),
    },
    body: JSON.stringify({ prefixText: texto, count: 10 }),
  });

  const { data } = await response.json();
  // Exibir sugestões para o usuário
};
```

### Caso 2: Preencher Requisição com Dados BEC

```javascript
// Usuário seleciona "notebook" no autocomplete
const response = await fetch("/api/bec/search-details", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "access-token": token,
  },
  body: JSON.stringify({ description: "notebook" }),
});

const { details } = await response.json();

// Preencher formulário automaticamente
formData.nome = details.titulo;
formData.categoria = details.categoria;
formData.descricao = details.descricao;
formData.tipo = details.subcategoria;
```

### Caso 3: Validação de Produto

```javascript
// Verificar se o produto existe no BEC antes de aprovar
async function validarProdutoBEC(descricao) {
  const response = await fetch("/api/bec/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-token": token,
    },
    body: JSON.stringify({ description: descricao }),
  });

  const { success, productId } = await response.json();
  return { existe: success, codigoBEC: productId };
}
```

## 🔒 Segurança

- ✅ Todas as rotas protegidas com autenticação JWT
- ✅ Validação de entrada em todos os endpoints
- ✅ Sanitização de parâmetros (trim, escape)
- ✅ Rate limiting recomendado (não implementado ainda)

## ⚡ Performance

### Otimizações Possíveis (Futuras)

1. **Cache Redis**

   ```javascript
   // Cachear produtos frequentemente consultados
   const cachedProduct = await redis.get(`bec:product:${cod_id}`);
   if (cachedProduct) return JSON.parse(cachedProduct);
   ```

2. **Queue System**

   ```javascript
   // Para múltiplas buscas simultâneas
   await queue.add("bec-search", { description });
   ```

3. **Rate Limiting**
   ```javascript
   // Limitar requisições por IP/usuário
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 100, // 100 requisições
   });
   ```

## 🐛 Troubleshooting

### Problema: "Nenhum produto encontrado"

**Causa:** Descrição muito específica ou produto não existe no BEC

**Solução:**

- Use termos mais genéricos
- Teste no site oficial: https://www.bec.sp.gov.br/BEC_Catalogo_ui/

### Problema: "Erro 500 - Timeout"

**Causa:** Site BEC está lento ou indisponível

**Solução:**

- Aguarde alguns minutos e tente novamente
- Verifique se o site BEC está acessível

### Problema: "Parsing retorna null"

**Causa:** Estrutura HTML do BEC mudou

**Solução:**

- Verifique os seletores CSS no `BECController.js`
- Atualize os IDs se necessário

## 📝 Dependências

```json
{
  "cheerio": "^1.0.0-rc.12" // Parsing HTML
}
```

## 🔄 Versionamento

### v1.0.0 - 31/10/2025

- ✨ Implementação inicial completa
- ✅ 4 endpoints funcionais
- ✅ Validações robustas
- ✅ Documentação completa
- ✅ Testes HTTP inclusos

## 👥 Contribuindo

Para adicionar novos endpoints ou melhorar o parsing:

1. Edite `controllers/BECController.js`
2. Adicione validações em `validators/BECValidator.js`
3. Registre a rota em `routes/BECRoute.js`
4. Atualize a documentação em `docs/BEC_API.md`
5. Adicione testes em `http/bec.http`

## 📚 Referências

- [Site BEC](https://www.bec.sp.gov.br/)
- [Cheerio Documentation](https://cheerio.js.org/)
- [Express Validator](https://express-validator.github.io/)

---

**Desenvolvido por:** Thiago Diegoli  
**Data:** 31 de Outubro de 2025  
**Versão do Projeto:** 0.12.0
