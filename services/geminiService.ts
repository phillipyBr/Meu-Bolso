import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  try {
    // 1. Prepare data for the prompt
    const transactionSummary = transactions.map(t => 
      `- ${t.date}: ${t.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${t.amount.toFixed(2)} em ${t.category} (${t.description})`
    ).join('\n');

    const prompt = `
      Analise os seguintes dados financeiros do usuário "Meu Bolso":
      
      ${transactionSummary}
      
      Por favor, forneça:
      1. Uma breve análise do padrão de gastos.
      2. Três dicas práticas e acionáveis para economizar dinheiro baseadas especificamente nestes gastos.
      3. Um comentário motivacional curto.
      
      Responda em português do Brasil. Use formatação Markdown (negrito, listas) para facilitar a leitura. Seja amigável e direto.
    `;

    // 2. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é um consultor financeiro pessoal experiente, amigável e focado em ajudar brasileiros a organizar suas finanças.",
      }
    });

    return response.text || "Não foi possível gerar uma análise no momento. Tente novamente mais tarde.";
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Ocorreu um erro ao conectar com o consultor IA. Verifique sua conexão ou tente novamente mais tarde.";
  }
};