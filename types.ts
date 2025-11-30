export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Alimentação'
  | 'Moradia'
  | 'Transporte'
  | 'Lazer'
  | 'Saúde'
  | 'Educação'
  | 'Salário'
  | 'Investimentos'
  | 'Outros';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
}

export type ViewState = 'dashboard' | 'transactions' | 'advisor';

export type FilterType = 'all' | 'income' | 'expense';