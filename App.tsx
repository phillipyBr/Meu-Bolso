import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  BrainCircuit, 
  Wallet,
  Settings
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { AIAdvisor } from './components/AIAdvisor';
import { CategoryManager } from './components/CategoryManager';
import { Transaction, ViewState, FilterType, CategoryState, TransactionType } from './types';
import { INITIAL_TRANSACTIONS, DEFAULT_CATEGORIES } from './constants';

const App: React.FC = () => {
  // Initialize transactions from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('meuBolso_data_v1');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Initialize categories from localStorage
  const [categories, setCategories] = useState<CategoryState>(() => {
    const saved = localStorage.getItem('meuBolso_categories_v1');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Persist data whenever it changes
  useEffect(() => {
    localStorage.setItem('meuBolso_data_v1', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('meuBolso_categories_v1', JSON.stringify(categories));
  }, [categories]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsFormOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (type: TransactionType, name: string) => {
    if (categories[type].includes(name)) return;
    setCategories(prev => ({
      ...prev,
      [type]: [...prev[type], name]
    }));
  };

  const deleteCategory = (type: TransactionType, name: string) => {
    setCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(c => c !== name)
    }));
  };

  const handleNavigate = (view: ViewState, filter: FilterType = 'all') => {
    setCurrentView(view);
    setCurrentFilter(filter);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} onNavigate={handleNavigate} />;
      case 'transactions':
        return (
          <TransactionList 
            transactions={transactions} 
            onDelete={deleteTransaction}
            initialFilter={currentFilter}
          />
        );
      case 'advisor':
        return <AIAdvisor transactions={transactions} />;
      case 'categories':
        return (
          <CategoryManager 
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
        );
      default:
        return <Dashboard transactions={transactions} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64 transition-all duration-300">
      {/* Mobile Header */}
      <header className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 text-emerald-600">
          <Wallet className="w-6 h-6" />
          <h1 className="text-xl font-bold">Meu Bolso</h1>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-30">
        <div className="p-6 flex items-center gap-2 text-emerald-600">
          <Wallet className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Meu Bolso</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => handleNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentView === 'dashboard' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => handleNavigate('transactions', 'all')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentView === 'transactions' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="w-5 h-5" />
            Extrato
          </button>
          <button 
            onClick={() => handleNavigate('advisor')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentView === 'advisor' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BrainCircuit className="w-5 h-5" />
            Consultor IA
          </button>
          <button 
            onClick={() => handleNavigate('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentView === 'categories' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            Categorias
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-emerald-600/20"
          >
            <PlusCircle className="w-5 h-5" />
            Nova Transação
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-20 pb-safe">
        <button 
          onClick={() => handleNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-xs font-medium">Início</span>
        </button>
        <button 
          onClick={() => handleNavigate('transactions', 'all')}
          className={`flex flex-col items-center gap-1 ${currentView === 'transactions' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <List className="w-6 h-6" />
          <span className="text-xs font-medium">Extrato</span>
        </button>
        <button 
          onClick={() => handleNavigate('categories')}
          className={`flex flex-col items-center gap-1 ${currentView === 'categories' ? 'text-gray-800' : 'text-gray-400'}`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs font-medium">Categorias</span>
        </button>
        <button 
          onClick={() => handleNavigate('advisor')}
          className={`flex flex-col items-center gap-1 ${currentView === 'advisor' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <BrainCircuit className="w-6 h-6" />
          <span className="text-xs font-medium">IA</span>
        </button>
      </nav>

      {/* Add Transaction Modal */}
      {isFormOpen && (
        <TransactionForm 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={addTransaction}
          categories={categories}
        />
      )}
    </div>
  );
};

export default App;