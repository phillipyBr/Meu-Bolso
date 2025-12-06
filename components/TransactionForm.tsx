import React, { useState } from 'react';
import { Transaction, TransactionType, CategoryState } from '../types';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  categories: CategoryState;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSubmit, categories }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Nova Transação</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory(''); }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                type === 'expense' 
                  ? 'border-red-500 bg-red-50 text-red-600' 
                  : 'border-gray-100 hover:border-gray-200 text-gray-500'
              }`}
            >
              <ArrowDownCircle className="w-5 h-5" />
              <span className="font-medium">Despesa</span>
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategory(''); }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                type === 'income' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                  : 'border-gray-100 hover:border-gray-200 text-gray-500'
              }`}
            >
              <ArrowUpCircle className="w-5 h-5" />
              <span className="font-medium">Receita</span>
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">R$</span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              type="text"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              placeholder="Ex: Supermercado, Salário..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              required
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white"
            >
              <option value="" disabled>Selecione uma categoria</option>
              {categories[type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {categories[type].length === 0 && (
              <p className="text-xs text-red-500 mt-1">Nenhuma categoria cadastrada. Vá em Ajustes para criar.</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all mt-4"
          >
            Salvar Transação
          </button>
        </form>
      </div>
    </div>
  );
};