export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Loan {
  id: string;
  name: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  description: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  description: string;
}

export interface Owe {
  id: string;
  name: string;
  amount: number;
  receivedAmount: number;
  dueDate: string;
  description: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  description: string;
}

export interface CategoryDef {
  id: string;
  name: string;
  emoji: string;
  color: string;
  hex: string;
}
