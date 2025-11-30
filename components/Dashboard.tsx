import React, { useMemo } from 'react';
import { Transaction, ViewState, FilterType } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  onNavigate?: (view: ViewState, filter?: FilterType) => void;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions, onNavigate }) => {
  
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Monthly totals for the last 6 months
  const chartData = useMemo(() => {
    const today = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      // Create date for 1st of month, going back from 5 to 0 months ago
      const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
      return {
        month: d.getMonth(), // 0-11
        year: d.getFullYear(),
        label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
      };
    });

    return last6Months.map(({ month, year, label }) => {
      const income = transactions
        .filter(t => {
          const [tYear, tMonth] = t.date.split('-').map(Number);
          // tMonth is 1-based from YYYY-MM-DD
          return t.type === 'income' && tYear === year && (tMonth - 1) === month;
        })
        .reduce((acc, t) => acc + t.amount, 0);

      const expense = transactions
        .filter(t => {
          const [tYear, tMonth] = t.date.split('-').map(Number);
          return t.type === 'expense' && tYear === year && (tMonth - 1) === month;
        })
        .reduce((acc, t) => acc + t.amount, 0);

      return {
        name: label,
        Receitas: income,
        Despesas: expense
      };
    });
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div 
          onClick={() => onNavigate?.('transactions', 'all')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Saldo Total</h3>
            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-gray-800' : 'text-red-500'}`}>
            R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Income Card - Clickable */}
        <div 
          onClick={() => onNavigate?.('transactions', 'income')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all"
          title="Ver detalhes de receitas"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Receitas</h3>
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-blue-500 mt-2 font-medium">Toque para ver detalhes</p>
        </div>

        {/* Expense Card - Clickable */}
        <div 
          onClick={() => onNavigate?.('transactions', 'expense')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all"
          title="Ver detalhes de despesas"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Despesas</h3>
            <div className="p-2 bg-red-100 rounded-full text-red-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            R$ {stats.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-red-500 mt-2 font-medium">Toque para ver detalhes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[350px]">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Fluxo Mensal (Últimos 6 meses)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
              />
              <RechartsTooltip 
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="Receitas" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[350px]">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Despesas por Categoria</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Nenhuma despesa registrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
};