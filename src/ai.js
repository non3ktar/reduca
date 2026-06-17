import Groq from "groq-sdk";

const apiKeyB64 = import.meta.env.VITE_GROQ_API_KEY_B64;
const apiKey = apiKeyB64 ? atob(apiKeyB64) : null;

let groq = null;
if (apiKey && apiKey !== 'coloque_sua_chave_aqui') {
  // Configurando dangerouslyAllowBrowser porque estamos chamando do client-side no React.
  // Em produção o ideal é passar isso por um backend (Supabase Edge Function), mas pro escopo local/Vibe serve.
  groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
}

export const generatePostFromTopic = async (topic) => {
  if (!groq) {
    throw new Error('Chave da API do Groq não configurada. Defina VITE_GROQ_API_KEY no .env');
  }

  const prompt = `Atue como um professor ou especialista educacional. O usuário pediu para criar um post ou conteúdo sobre o seguinte tema: "${topic}".
Escreva um texto curto, dinâmico e interessante, ideal para um feed de uma rede social educacional chamada Reduca.
Use emojis apropriados. Não precisa de título longo, vá direto ao ponto. Mantenha em no máximo 3 ou 4 parágrafos pequenos.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", // Modelo incrivelmente rápido do Groq
      temperature: 0.7,
      max_tokens: 500,
    });
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error('Erro ao gerar post com Groq:', error);
    throw new Error(`Erro da IA: ${error.message}`);
  }
};

export const chatWithAI = async (message, history = []) => {
  if (!groq) {
    throw new Error('Chave da API do Groq não configurada.');
  }
  
  // Transformando o formato local de history para o formato de mensagens do Groq (OpenAI compatível)
  const systemMessage = {
    role: "system",
    content: 'Você é o "Assistente Reduca", um assistente virtual para ajudar professores, alunos e gestores na rede social educacional Reduca. Seja amigável, prestativo e use uma linguagem clara.'
  };

  const formattedHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant', // Groq usa 'assistant' em vez de 'model'
    content: msg.text
  }));

  const messages = [
    systemMessage,
    ...formattedHistory,
    { role: "user", content: message }
  ];

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 800,
    });
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Erro no chat IA com Groq:", error);
    throw new Error(`Erro da IA: ${error.message}`);
  }
};
