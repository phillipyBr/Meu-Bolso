import React, { useState } from 'react';
import { CategoryState, TransactionType } from '../types';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';

interface CategoryManagerProps {
  categories: CategoryState;
  onAddCategory: (type: TransactionType, name: string) => void;
  onDeleteCategory: (type: TransactionType, name: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  categories, 
  onAddCategory, 
  onDeleteCategory 
}) => {
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    onAddCategory(activeTab, newCategory.trim());
    setNewCategory('');
  };

  const handleDelete = (category: string) => {
    if (window.confirm(`Deseja excluir a categoria "${category}"?`)) {
      onDeleteCategory(activeTab, category);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in max-w-2xl mx-auto">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Gerenciar Categorias</h2>
        <p className="text-sm text-gray-500 mt-1">Crie ou remova categorias para personalizar seu controle.</p>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'expense' 
                ? 'bg-white text-red-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            Despesas
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'income' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            Receitas
          </button>
        </div>

        {/* Add Form */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={`Nova categoria de ${activeTab === 'income' ? 'receita' : 'despesa'}...`}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!newCategory.trim()}
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        {/* List */}
        <div className="space-y-3">
          {categories[activeTab].length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p>Nenhuma categoria cadastrada.</p>
            </div>
          ) : (
            categories[activeTab].map((cat) => (
              <div 
                key={cat} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all group"
              >
                <span className="font-medium text-gray-700">{cat}</span>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  title="Excluir categoria"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};