import intents from "../intents.json" with { type: "json" };
import { addDocuments, vectorize } from "../utils/tfidf.js";
import { train, predict } from "../utils/logistic.js";
import { checkYesNo } from "../utils/yesNoDetector.js";

//     MEMÓRIA DE CONTEXTO
let lastIntent = null;

//     TREINAMENTO DO MODELO

const X_train = [];
const y_train = [];
const allPatterns = [];

// Coletar todos os padrões
intents.intents.forEach((intent, idx) => {
  intent.patterns.forEach(p => allPatterns.push(p));
});

// Adicionar documentos ao TFIDF
addDocuments(allPatterns);

// Criar vetores + classes
intents.intents.forEach((intent, idx) => {
  intent.patterns.forEach(pattern => {
    X_train.push(vectorize(pattern));
    y_train.push(idx);
  });
});

// Treinar modelo (uma única vez)
train(X_train, y_train);

// Mapas de contexto sim/não
const affirmativeMap = {
  "saudacao": "ajuda_sim",
  "problema_pedido": "pedido_sugestao_sim"
};

const negativeMap = {
  "saudacao": "ajuda_nao",
  "problema_pedido": "pedido_sugestao_nao"
};

//     CONTROLLER PRINCIPAL

export const chatbotController = {
  async handleChat(req, res) {
    try {
      const { message } = req.body;

      if (!message || message.trim() === "") {
        return res.json({ reply: "Digite algo para eu entender." });
      }
      // 1. DETECÇÃO SIM/NÃO
      const yesNo = checkYesNo(message);

      if (yesNo === "affirmation") {
        const mapped = affirmativeMap[lastIntent];
        if (mapped) {
          const intent = intents.intents.find(i => i.tag === mapped);
          lastIntent = mapped;
          const random = Math.floor(Math.random() * intent.responses.length);
          return res.json({ reply: intent.responses[random] });
        }
      }

      if (yesNo === "negation") {
        const mapped = negativeMap[lastIntent];
        if (mapped) {
          const intent = intents.intents.find(i => i.tag === mapped);
          lastIntent = mapped;
          const random = Math.floor(Math.random() * intent.responses.length);
          return res.json({ reply: intent.responses[random] });
        }
      }

      // 2. CLASSIFICAÇÃO
      const vec = vectorize(message);
      const result = predict(vec);

      const intentIdx = result[0];
      const intent = intents.intents[intentIdx];

      lastIntent = intent.tag || intent.intent;

      let reply;

      if (intent.responses && intent.responses.length > 0) {
        const random = Math.floor(Math.random() * intent.responses.length);
        reply = intent.responses[random];
      } else {
        reply = "Desculpe, não consegui entender. Pode reescrever?";
      }

      return res.json({ reply });

    } catch (err) {
      console.error("Erro no chatbot:", err);
      return res.status(500).json({ reply: "Erro interno no chatbot." });
    }
  },

  async greet(req, res) {
    const intent = intents.intents.find(i => i.tag === "saudacao");

    lastIntent = "saudacao";

    if (!intent || !intent.responses || intent.responses.length === 0) {
      return res.json({ reply: "Erro: intent de saudação não encontrada." });
    }

    const random = Math.floor(Math.random() * intent.responses.length);

    return res.json({ reply: intent.responses[random] });
  }
};
