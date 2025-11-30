import React, { useState } from 'react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { BrainCircuit, Sparkles, AlertCircle } from 'lucide-react';

interface AIAdvisorProps {
  transactions: Transaction[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleAnalysis = async () => {
    if (transactions.length === 0) return;
    
    setLoading(true);
    setHasError(false);
    
    try {
      const result = await getFinancialAdvice(transactions);
      setAdvice(result);
    } catch (e) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Consultor Financeiro IA</h2>
          </div>
          <p className="text-purple-100 mb-8 max-w-lg">
            Utilize a inteligência artificial do Google Gemini para analisar seus gastos, 
            identificar padrões e receber dicas personalizadas de economia.
          </p>
          
          <button
            onClick={handleAnalysis}
            disabled={loading || transactions.length === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-lg
              ${transactions.length === 0 
                ? 'bg-purple-900/50 text-purple-300 cursor-not-allowed' 
                : 'bg-white text-purple-700 hover:bg-purple-50 hover:scale-105 active:scale-95'
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
                Analisando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {advice ? 'Gerar Nova Análise' : 'Analisar Minhas Finanças'}
              </>
            )}
          </button>
          
          {transactions.length === 0 && (
            <p className="mt-4 text-sm text-purple-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Adicione algumas transações para habilitar a análise.
            </p>
          )}
        </div>
      </div>

      {advice && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">
          <div className="prose prose-purple max-w-none">
            {advice.split('\n').map((line, index) => {
              // Simple markdown parsing for the demo
              if (line.startsWith('###')) return <h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.replace('###', '')}</h3>;
              if (line.startsWith('**')) return <p key={index} className="font-bold text-gray-800 my-2">{line.replace(/\*\*/g, '')}</p>;
              if (line.startsWith('-') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
                return <li key={index} className="ml-4 text-gray-600 my-1 list-disc">{line.replace(/^[-*]\s/, '').replace(/^\d\.\s/, '')}</li>;
              }
              if (line.trim() === '') return <br key={index} />;
              return <p key={index} className="text-gray-600 leading-relaxed">{line.replace(/\*\*/g, '')}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
};