import * as cheerio from "cheerio";

const BASE_URL = "https://www.bec.sp.gov.br/BEC_Catalogo_ui";

/**
 * Endpoint para obter lista de produtos (autocomplete)
 * @route POST /api/bec/products
 * @param {string} prefixText - Texto de busca
 * @param {number} count - Quantidade de resultados (padrão: 20)
 */
export const getProducts = async (req, res) => {
  try {
    const { prefixText, count = 20 } = req.body;

    if (!prefixText) {
      return res.status(400).json({
        success: false,
        message: "O campo 'prefixText' é obrigatório",
      });
    }

    const url = `${BASE_URL}/WebService/AutoComplete.asmx/GetItensList`;
    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    };
    const body = JSON.stringify({ prefixText, count });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
    }

    const data = await response.json();
    const products = data.d || [];

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    console.error("Erro em getProducts:", err);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar produtos",
      error: err.message,
    });
  }
};

/**
 * Endpoint para buscar produto por descrição
 * @route POST /api/bec/search
 * @param {string} description - Descrição do produto
 * @returns {string} ID do produto encontrado
 */
export const searchProduct = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "O campo 'description' é obrigatório",
      });
    }

    const url = `${BASE_URL}/CatalogoPesquisa3.aspx?chave=&pesquisa=Y&cod_id=&ds_item=${encodeURIComponent(
      description
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar produto: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Buscar o primeiro resultado usando cheerio
    const firstProductLink = $(
      "#ContentPlaceHolder1_gvResultadoPesquisa_lbTituloItem_0"
    );
    const productText = firstProductLink.text().trim();

    let productId = null;
    if (productText) {
      productId = productText.split(" ")[0];
    }

    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Nenhum produto encontrado com essa descrição",
        productId: null,
      });
    }

    res.status(200).json({
      success: true,
      productId,
      description,
    });
  } catch (err) {
    console.error("Erro em searchProduct:", err);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar produto",
      error: err.message,
    });
  }
};

/**
 * Endpoint para obter detalhes de um produto
 * @route GET /api/bec/product/:cod_id
 * @param {string} cod_id - Código do produto
 * @returns {object} Detalhes estruturados do produto
 */
export const getProductDetails = async (req, res) => {
  try {
    const { cod_id } = req.params;

    if (!cod_id) {
      return res.status(400).json({
        success: false,
        message: "O parâmetro 'cod_id' é obrigatório",
      });
    }

    const url = `${BASE_URL}/CatalogDetalheNovo.aspx?chave=&cod_id=${encodeURIComponent(
      cod_id
    )}&selo=&origem=CatalogoPesquisa3`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao obter detalhes do produto: ${response.statusText}`
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extrair informações estruturadas do produto
    const productDetails = {
      cod_id,
      grupo: $("#ContentPlaceHolder1_lbGrupoInfo").text().trim() || null,
      classe: $("#ContentPlaceHolder1_lbClasseInfo").text().trim() || null,
      material: $("#ContentPlaceHolder1_lbMaterialInfo").text().trim() || null,
      elemento: $("#ContentPlaceHolder1_lbNElementoDespesaInfo").text().trim() || null,
      natureza: $("#ContentPlaceHolder1_lbNdInfo").text().trim().replace(/\r?\n/g, ' ') || null,
    };

    res.status(200).json({
      success: true,
      data: productDetails,
    });
  } catch (err) {
    console.error("Erro em getProductDetails:", err);
    res.status(500).json({
      success: false,
      message: "Erro ao obter detalhes do produto",
      error: err.message,
    });
  }
};

/**
 * Endpoint combinado: busca o produto e retorna os detalhes
 * @route POST /api/bec/search-details
 * @param {string} description - Descrição do produto
 * @returns Detalhes completos do produto
 */
export const searchAndGetDetails = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "O campo 'description' é obrigatório",
      });
    }

    // Primeiro, buscar o produto
    const searchUrl = `${BASE_URL}/CatalogoPesquisa3.aspx?chave=&pesquisa=Y&cod_id=&ds_item=${encodeURIComponent(
      description
    )}`;

    const searchResponse = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!searchResponse.ok) {
      throw new Error(`Erro ao buscar produto: ${searchResponse.statusText}`);
    }

    const searchHtml = await searchResponse.text();
    const $search = cheerio.load(searchHtml);

    // Buscar o primeiro resultado
    const firstProductLink = $(
      "#ContentPlaceHolder1_gvResultadoPesquisa_lbTituloItem_0"
    );
    const productText = firstProductLink.text().trim();

    let productId = null;
    if (productText) {
      productId = productText.split(" ")[0];
    }

    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Nenhum produto encontrado com essa descrição",
      });
    }

    // Agora, buscar os detalhes do produto
    const detailsUrl = `${BASE_URL}/CatalogDetalheNovo.aspx?chave=&cod_id=${encodeURIComponent(
      productId
    )}&selo=&origem=CatalogoPesquisa3`;

    const detailsResponse = await fetch(detailsUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!detailsResponse.ok) {
      throw new Error(
        `Erro ao obter detalhes do produto: ${detailsResponse.statusText}`
      );
    }

    const detailsHtml = await detailsResponse.text();
    const $details = cheerio.load(detailsHtml);

    // Extrair informações estruturadas
    const productDetails = {
      cod_id: productId,
      grupo: $details("#ContentPlaceHolder1_lbGrupoInfo").text().trim() || null,
      classe: $details("#ContentPlaceHolder1_lbClasseInfo").text().trim() || null,
      material: $details("#ContentPlaceHolder1_lbMaterialInfo").text().trim() || null,
      elemento: $details("#ContentPlaceHolder1_lbNElementoDespesaInfo").text().trim() || null,
      natureza: $details("#ContentPlaceHolder1_lbNdInfo").text().trim().replace(/\r?\n/g, ' ') || null,
    };

    res.status(200).json({
      success: true,
      productId,
      description,
      details: productDetails,
    });
  } catch (err) {
    console.error("Erro em searchAndGetDetails:", err);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar e obter detalhes do produto",
      error: err.message,
    });
  }
};
