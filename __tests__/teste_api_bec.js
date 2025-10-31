/**
 * Testes para a API BEC Web Scraping
 *
 * Para executar:
 * npm test -- __tests__/teste_api_bec.js
 */

import request from "supertest";

const BASE_URL = "http://localhost:4000";
let authToken = "";

describe("BEC API - Web Scraping", () => {
  // Setup: Fazer login antes dos testes
  beforeAll(async () => {
    // Você precisa ter um usuário de teste no banco
    const loginResponse = await request(BASE_URL)
      .post("/api/logins/login")
      .send({
        email: "teste@teste.com", // Ajuste para seu usuário de teste
        senha: "teste123",
      });

    if (loginResponse.status === 200) {
      authToken = loginResponse.body.access_token;
    }
  });

  describe("POST /api/bec/products", () => {
    it("deve retornar lista de produtos com autocomplete", async () => {
      const response = await request(BASE_URL)
        .post("/api/bec/products")
        .set("access-token", authToken)
        .send({
          prefixText: "cadeira",
          count: 10,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("deve retornar erro 400 quando prefixText está vazio", async () => {
      const response = await request(BASE_URL)
        .post("/api/bec/products")
        .set("access-token", authToken)
        .send({
          prefixText: "",
          count: 10,
        });

      expect(response.status).toBe(400);
    });

    it("deve retornar erro 401 quando não há token", async () => {
      const response = await request(BASE_URL).post("/api/bec/products").send({
        prefixText: "cadeira",
        count: 10,
      });

      expect(response.status).toBe(401);
    });

    it("deve retornar erro 400 quando count é inválido", async () => {
      const response = await request(BASE_URL)
        .post("/api/bec/products")
        .set("access-token", authToken)
        .send({
          prefixText: "cadeira",
          count: 200, // Máximo é 100
        });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/bec/search", () => {
    it("deve encontrar um produto por descrição", async () => {
      const response = await request(BASE_URL)
        .post("/api/bec/search")
        .set("access-token", authToken)
        .send({
          description: "cadeira escritorio",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("productId");
      expect(response.body).toHaveProperty("description", "cadeira escritorio");
    });

    it("deve retornar erro 400 quando description é muito curta", async () => {
      const response = await request(BASE_URL)
        .post("/api/bec/search")
        .set("access-token", authToken)
        .send({
          description: "ab", // Mínimo é 3 caracteres
        });

      expect(response.status).toBe(400);
    });

    it("deve retornar 404 quando produto não é encontrado", async () => {
      const response = await request(BASE_URL)
        .post("/api/bec/search")
        .set("access-token", authToken)
        .send({
          description: "xyzabc123produto_que_nao_existe",
        });

      // Pode ser 404 ou 200 com success: false
      expect([200, 404]).toContain(response.status);
    });
  });

  describe("GET /api/bec/product/:cod_id", () => {
    let productId = "";

    // Buscar um produto primeiro para ter um ID válido
    beforeAll(async () => {
      const searchResponse = await request(BASE_URL)
        .post("/api/bec/search")
        .set("access-token", authToken)
        .send({
          description: "cadeira",
        });

      if (searchResponse.body.productId) {
        productId = searchResponse.body.productId;
      }
    });

    it("deve retornar detalhes de um produto válido", async () => {
      if (!productId) {
        console.log("Pulando teste: nenhum produto encontrado para testar");
        return;
      }

      const response = await request(BASE_URL)
        .get(`/api/bec/product/${productId}`)
        .set("access-token", authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("cod_id", productId);
    });
  });

  describe("POST /api/bec/search-details", () => {
    it("deve buscar e retornar detalhes completos do produto", async () => {
      const response = await request(BASE_URL)
        .post("/api/bec/search-details")
        .set("access-token", authToken)
        .send({
          description: "notebook",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("productId");
      expect(response.body).toHaveProperty("details");
      expect(response.body.details).toHaveProperty("cod_id");
      expect(response.body.details).toHaveProperty("titulo");
    });

    it("deve retornar estrutura correta mesmo quando não encontra", async () => {
      const response = await request(BASE_URL)
        .post("/api/bec/search-details")
        .set("access-token", authToken)
        .send({
          description: "produto_inexistente_xyzabc",
        });

      expect([200, 404]).toContain(response.status);
      expect(response.body).toHaveProperty("success");
    });
  });

  describe("Validações de Segurança", () => {
    it("deve rejeitar requisição sem token em todas as rotas", async () => {
      const endpoints = [
        {
          method: "post",
          url: "/api/bec/products",
          body: { prefixText: "test" },
        },
        {
          method: "post",
          url: "/api/bec/search",
          body: { description: "test" },
        },
        { method: "get", url: "/api/bec/product/123" },
        {
          method: "post",
          url: "/api/bec/search-details",
          body: { description: "test" },
        },
      ];

      for (const endpoint of endpoints) {
        const response = await request(BASE_URL)
          [endpoint.method](endpoint.url)
          .send(endpoint.body || {});

        expect(response.status).toBe(401);
      }
    });
  });
});
