import React, { useState } from 'react';
import { Transaction, FilterType } from '../types';
import { Trash2, TrendingDown, TrendingUp, Calendar, Download } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  initialFilter?: FilterType;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onDelete, 
  initialFilter = 'all' 
}) => {
  const [filter, setFilter] = useState<FilterType>(initialFilter);

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  // Sort by date descending
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (e: React.MouseEvent, id: string, description: string) => {
    e.stopPropagation(); // Prevents clicking the row when clicking delete
    if (window.confirm(`Tem certeza que deseja apagar o lançamento "${description}"?`)) {
      onDelete(id);
    }
  };

  const handleExport = () => {
    if (sortedTransactions.length === 0) {
      alert("Não há transações para exportar.");
      return;
    }

    // Define CSV Headers
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'];

    // Map data to CSV rows
    const csvRows = sortedTransactions.map(t => {
      const date = new Date(t.date).toLocaleDateString('pt-BR');
      const type = t.type === 'income' ? 'Receita' : 'Despesa';
      // Format amount for CSV (Brazilian format but keeping it parseable if possible, usually requires quotes if using comma decimal)
      const amount = t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      
      // Escape quotes in description and wrap in quotes to handle commas
      const description = `"${t.description.replace(/"/g, '""')}"`;
      
      return `${date},${description},${t.category},${type},"${amount}"`;
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob with BOM for Excel UTF-8 compatibility
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    const fileName = `meu-bolso-extrato-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Histórico de Transações</h2>
            <p className="text-sm text-gray-500 mt-1">Gerencie seus lançamentos.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('income')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filter === 'income' 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                Receitas
              </button>
              <button
                onClick={() => setFilter('expense')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filter === 'expense' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingDown className="w-3 h-3" />
                Despesas
              </button>
            </div>

            {/* Export Button */}
            <button 
              onClick={handleExport}
              disabled={sortedTransactions.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              title="Exportar para Excel/CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>
      
      {sortedTransactions.length === 0 ? (
        <div className="p-10 text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Nenhuma transação encontrada {filter !== 'all' ? `no filtro "${filter === 'income' ? 'Receitas' : 'Despesas'}"` : ''}.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 overflow-auto max-h-[600px]">
          {sortedTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full flex-shrink-0 ${
                  transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{transaction.description}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs whitespace-nowrap">{transaction.category}</span>
                    <span className="hidden xs:inline">•</span>
                    <span className="whitespace-nowrap">{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pl-2">
                <span className={`font-bold whitespace-nowrap ${
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <button 
                  onClick={(e) => handleDelete(e, transaction.id, transaction.description)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Apagar lançamento"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};