import { Transaction, CategoryState } from "./types";

export const DEFAULT_CATEGORIES: CategoryState = {
  income: ['Salário', 'Investimentos', 'Outros'],
  expense: ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Outros']
};

export const INITIAL_TRANSACTIONS: Transaction[] = [];