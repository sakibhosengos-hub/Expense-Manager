import { useState, useEffect } from "react";
import { Download, Plus, Trash2, TrendingUp, Wallet } from "lucide-react";
import AddExpenseModal from "./components/AddExpenseModal";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import FinancialStatus from "./components/FinancialStatus";
import { exportAllToExcel } from "./utils/exportExcel";
import type { Expense, Loan, Debt, Owe, Goal } from "./types";

type TabType = "expenses" | "summary" | "financial";

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });
  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem("loans");
    return saved ? JSON.parse(saved) : [];
  });
  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem("debts");
    return saved ? JSON.parse(saved) : [];
  });
  const [owes, setOwes] = useState<Owe[]>(() => {
    const saved = localStorage.getItem("owes");
    return saved ? JSON.parse(saved) : [];
  });
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("goals");
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("expenses");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem("loans", JSON.stringify(loans));
  }, [loans]);
  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);
  useEffect(() => {
    localStorage.setItem("owes", JSON.stringify(owes));
  }, [owes]);
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const today = new Date();
  const todayStr = today.toDateString();
  const todayTotal = expenses
    .filter((e) => new Date(e.date).toDateString() === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = { ...expense, id: Date.now().toString() };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addLoan = (loan: Omit<Loan, "id" | "paidAmount">) => {
    const newLoan: Loan = { ...loan, id: Date.now().toString(), paidAmount: 0 };
    setLoans((prev) => [newLoan, ...prev]);
  };

  const addDebt = (debt: Omit<Debt, "id" | "paidAmount">) => {
    const newDebt: Debt = { ...debt, id: Date.now().toString(), paidAmount: 0 };
    setDebts((prev) => [newDebt, ...prev]);
  };

  const addOwe = (owe: Omit<Owe, "id" | "receivedAmount">) => {
    const newOwe: Owe = { ...owe, id: Date.now().toString(), receivedAmount: 0 };
    setOwes((prev) => [newOwe, ...prev]);
  };

  const addGoal = (goal: Omit<Goal, "id" | "savedAmount">) => {
    const newGoal: Goal = { ...goal, id: Date.now().toString(), savedAmount: 0 };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const updateLoanPayment = (id: string, paidAmount: number) => {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, paidAmount } : l)));
  };

  const updateDebtPayment = (id: string, paidAmount: number) => {
    setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, paidAmount } : d)));
  };

  const updateOweReceived = (id: string, receivedAmount: number) => {
    setOwes((prev) => prev.map((o) => (o.id === id ? { ...o, receivedAmount } : o)));
  };

  const updateGoalSaved = (id: string, savedAmount: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, savedAmount } : g)));
  };

  const deleteLoan = (id: string) => setLoans((prev) => prev.filter((l) => l.id !== id));
  const deleteDebt = (id: string) => setDebts((prev) => prev.filter((d) => d.id !== id));
  const deleteOwe = (id: string) => setOwes((prev) => prev.filter((o) => o.id !== id));
  const deleteGoal = (id: string) => setGoals((prev) => prev.filter((g) => g.id !== id));

  const handleClearData = () => {
    if (!confirm("Are you sure you want to clear ALL data? This cannot be undone.")) return;
    setExpenses([]);
    setLoans([]);
    setDebts([]);
    setOwes([]);
    setGoals([]);
    localStorage.removeItem("expenses");
    localStorage.removeItem("loans");
    localStorage.removeItem("debts");
    localStorage.removeItem("owes");
    localStorage.removeItem("goals");
    localStorage.removeItem("custom_categories");
  };

  const handleExport = () => {
    exportAllToExcel(expenses, loans, debts, owes, goals);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Wallet className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">Expense Manager</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                title="Download Excel"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleClearData}
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                title="Clear All Data"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-1">Today's Expense</div>
            <div className="text-4xl font-bold">৳{todayTotal.toFixed(2)}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "expenses" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Expenses
            {activeTab === "expenses" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${
              activeTab === "summary" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Summary
            {activeTab === "summary" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("financial")}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${
              activeTab === "financial" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Financial Status
            {activeTab === "financial" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "expenses" && (
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          )}
          {activeTab === "summary" && <Summary expenses={expenses} />}
          {activeTab === "financial" && (
            <FinancialStatus
              loans={loans}
              debts={debts}
              owes={owes}
              goals={goals}
              onAddLoan={addLoan}
              onAddDebt={addDebt}
              onAddOwe={addOwe}
              onAddGoal={addGoal}
              onUpdateLoanPayment={updateLoanPayment}
              onUpdateDebtPayment={updateDebtPayment}
              onUpdateOweReceived={updateOweReceived}
              onUpdateGoalSaved={updateGoalSaved}
              onDeleteLoan={deleteLoan}
              onDeleteDebt={deleteDebt}
              onDeleteOwe={deleteOwe}
              onDeleteGoal={deleteGoal}
            />
          )}
        </div>

        {/* Add Expense Button */}
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={() => setShowAddExpense(true)}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <AddExpenseModal onAddExpense={addExpense} onClose={() => setShowAddExpense(false)} />
        )}
      </div>
    </div>
  );
}
