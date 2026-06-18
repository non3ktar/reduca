import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKeyB64 = import.meta.env.VITE_GEMINI_API_KEY_B64;
const apiKey = apiKeyB64 ? atob(apiKeyB64) : null;

let genAI = null;
if (apiKey && apiKey !== 'coloque_sua_chave_aqui') {
  genAI = new GoogleGenerativeAI(apiKey);
}

export const generatePostFromTopic = async (topic) => {
  if (!genAI) {
    throw new Error('Chave da API do Gemini não configurada. Defina VITE_GEMINI_API_KEY_B64 no .env');
  }

  const prompt = `Atue como um professor ou especialista educacional. O usuário pediu para criar um post ou conteúdo sobre o seguinte tema: "${topic}".
Escreva um texto curto, dinâmico e interessante, ideal para um feed de uma rede social educacional chamada Reduca.
Use emojis apropriados. Não precisa de título longo, vá direto ao ponto. Mantenha em no máximo 3 ou 4 parágrafos pequenos.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text() || "";
  } catch (error) {
    console.error('Erro ao gerar post com Gemini:', error);
    throw new Error(`Erro da IA: ${error.message}`);
  }
};

export const chatWithAI = async (message, history = []) => {
  if (!genAI) {
    throw new Error('Chave da API do Gemini não configurada.');
  }
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: 'Você é o "Assistente Reduca", um assistente virtual para ajudar professores, alunos e gestores na rede social educacional Reduca. Seja amigável, prestativo e use uma linguagem clara.'
    });

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      }
    });

    const result = await chat.sendMessage(message);
    return result.response.text() || "";
  } catch (error) {
    console.error("Erro no chat IA com Gemini:", error);
    throw new Error(`Erro da IA: ${error.message}`);
  }
};
