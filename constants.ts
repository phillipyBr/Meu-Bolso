import { Transaction } from "./types";

export const CATEGORIES = {
  income: ['Salário', 'Investimentos', 'Outros'],
  expense: ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Outros']
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    category: 'Salário',
    description: 'Salário Mensal',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '2',
    type: 'expense',
    amount: 850,
    category: 'Moradia',
    description: 'Aluguel',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '3',
    type: 'expense',
    amount: 320.50,
    category: 'Alimentação',
    description: 'Supermercado Semanal',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '4',
    type: 'expense',
    amount: 150,
    category: 'Lazer',
    description: 'Cinema e Jantar',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0] // Yesterday
  }
];