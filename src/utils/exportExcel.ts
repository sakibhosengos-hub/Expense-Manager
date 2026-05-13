import * as XLSX from "xlsx";
import type { Expense, Loan, Debt, Owe, Goal } from "../types";
import { getCategoryMap } from "../data/categories";

export function exportExpensesToExcel(expenses: Expense[]) {
  const map = getCategoryMap();
  const data = expenses.map((e) => ({
    Date: e.date,
    Category: map[e.category]?.name || e.category,
    Description: e.description || "",
    Amount: e.amount,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Expenses");
  XLSX.writeFile(wb, "expenses.xlsx");
}

export function exportAllToExcel(
  expenses: Expense[],
  loans: Loan[],
  debts: Debt[],
  owes: Owe[],
  goals: Goal[]
) {
  const map = getCategoryMap();
  const wb = XLSX.utils.book_new();

  const expenseData = expenses.map((e) => ({
    Date: e.date,
    Category: map[e.category]?.name || e.category,
    Description: e.description || "",
    Amount: e.amount,
  }));
  const ws1 = XLSX.utils.json_to_sheet(expenseData);
  XLSX.utils.book_append_sheet(wb, ws1, "Expenses");

  const loanData = loans.map((l) => ({
    Name: l.name,
    Amount: l.amount,
    "Paid Amount": l.paidAmount,
    "Due Date": l.dueDate || "",
    Description: l.description || "",
  }));
  const ws2 = XLSX.utils.json_to_sheet(loanData);
  XLSX.utils.book_append_sheet(wb, ws2, "Loans");

  const debtData = debts.map((d) => ({
    Name: d.name,
    Amount: d.amount,
    "Paid Amount": d.paidAmount,
    "Due Date": d.dueDate || "",
    Description: d.description || "",
  }));
  const ws3 = XLSX.utils.json_to_sheet(debtData);
  XLSX.utils.book_append_sheet(wb, ws3, "Debts");

  const oweData = owes.map((o) => ({
    Name: o.name,
    Amount: o.amount,
    "Received Amount": o.receivedAmount,
    "Due Date": o.dueDate || "",
    Description: o.description || "",
  }));
  const ws4 = XLSX.utils.json_to_sheet(oweData);
  XLSX.utils.book_append_sheet(wb, ws4, "Owes Me");

  const goalData = goals.map((g) => ({
    Name: g.name,
    "Target Amount": g.targetAmount,
    "Saved Amount": g.savedAmount,
    "Target Date": g.targetDate || "",
    Description: g.description || "",
  }));
  const ws5 = XLSX.utils.json_to_sheet(goalData);
  XLSX.utils.book_append_sheet(wb, ws5, "Goals");

  XLSX.writeFile(wb, "financial_data.xlsx");
}
