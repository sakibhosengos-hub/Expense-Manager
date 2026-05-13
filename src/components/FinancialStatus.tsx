import { useState } from "react";
import { Plus, Target, TrendingDown, TrendingUp, Trash2, User } from "lucide-react";
import type { Loan, Debt, Owe, Goal } from "../types";

interface FinancialStatusProps {
  loans: Loan[];
  debts: Debt[];
  owes: Owe[];
  goals: Goal[];
  onAddLoan: (loan: Omit<Loan, "id" | "paidAmount">) => void;
  onAddDebt: (debt: Omit<Debt, "id" | "paidAmount">) => void;
  onAddOwe: (owe: Omit<Owe, "id" | "receivedAmount">) => void;
  onAddGoal: (goal: Omit<Goal, "id" | "savedAmount">) => void;
  onUpdateLoanPayment: (id: string, paidAmount: number) => void;
  onUpdateDebtPayment: (id: string, paidAmount: number) => void;
  onUpdateOweReceived: (id: string, receivedAmount: number) => void;
  onUpdateGoalSaved: (id: string, savedAmount: number) => void;
  onDeleteLoan: (id: string) => void;
  onDeleteDebt: (id: string) => void;
  onDeleteOwe: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

type TabType = "goals" | "loans" | "debts" | "owes";

interface FormState {
  name: string;
  amount: string;
  dueDate: string;
  description: string;
}

export default function FinancialStatus({
  loans,
  debts,
  owes,
  goals,
  onAddLoan,
  onAddDebt,
  onAddOwe,
  onAddGoal,
  onUpdateLoanPayment,
  onUpdateDebtPayment,
  onUpdateOweReceived,
  onUpdateGoalSaved,
  onDeleteLoan,
  onDeleteDebt,
  onDeleteOwe,
  onDeleteGoal,
}: FinancialStatusProps) {
  const [activeTab, setActiveTab] = useState<TabType>("goals");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", amount: "", dueDate: "", description: "" });

  const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);
  const totalLoansPaid = loans.reduce((sum, l) => sum + l.paidAmount, 0);
  const totalDebts = debts.reduce((sum, d) => sum + d.amount, 0);
  const totalDebtsPaid = debts.reduce((sum, d) => sum + d.paidAmount, 0);
  const totalOwes = owes.reduce((sum, o) => sum + o.amount, 0);
  const totalOwesReceived = owes.reduce((sum, o) => sum + o.receivedAmount, 0);
  const totalGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalGoalsSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.name || !amt) return;

    const base = { name: form.name, amount: amt, dueDate: form.dueDate, description: form.description };

    if (activeTab === "loans") onAddLoan(base);
    else if (activeTab === "debts") onAddDebt(base);
    else if (activeTab === "owes") onAddOwe(base);
    else if (activeTab === "goals") onAddGoal({ ...base, targetAmount: amt, targetDate: form.dueDate });

    setForm({ name: "", amount: "", dueDate: "", description: "" });
    setShowAddModal(false);
  };

  const handlePay = (id: string, current: number, total: number, type: TabType) => {
    const input = prompt(`Enter amount to ${type === "goals" ? "add" : "pay"} (৳):`);
    if (!input) return;
    const amt = parseFloat(input);
    if (amt <= 0) return;
    const newAmount = Math.min(current + amt, total);

    if (type === "loans") onUpdateLoanPayment(id, newAmount);
    else if (type === "debts") onUpdateDebtPayment(id, newAmount);
    else if (type === "owes") onUpdateOweReceived(id, newAmount);
    else if (type === "goals") onUpdateGoalSaved(id, newAmount);
  };

  const renderItem = (
    item: Loan | Debt | Owe | Goal,
    type: TabType
  ) => {
    let paid = 0;
    let total = 0;
    let percent = 0;

    if ("paidAmount" in item) {
      paid = item.paidAmount;
      total = item.amount;
      percent = (item.paidAmount / item.amount) * 100;
    } else if ("receivedAmount" in item) {
      paid = item.receivedAmount;
      total = item.amount;
      percent = (item.receivedAmount / item.amount) * 100;
    } else if ("savedAmount" in item) {
      paid = item.savedAmount;
      total = item.targetAmount;
      percent = (item.savedAmount / item.targetAmount) * 100;
    }

    const remaining = total - paid;
    const dueDate = "dueDate" in item ? item.dueDate : ("targetDate" in item ? item.targetDate : "");

    return (
      <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{item.name}</h4>
            {item.description && (
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            )}
          </div>
          <button
            onClick={() => {
              if (type === "loans") onDeleteLoan(item.id);
              else if (type === "debts") onDeleteDebt(item.id);
              else if (type === "owes") onDeleteOwe(item.id);
              else if (type === "goals") onDeleteGoal(item.id);
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {type === "goals" ? "Saved" : type === "owes" ? "Received" : "Paid"}
            </span>
            <span className="font-semibold text-gray-900">
              ৳{paid.toFixed(2)} / ৳{total.toFixed(2)}
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                type === "goals"
                  ? "bg-green-500"
                  : type === "owes"
                  ? "bg-blue-500"
                  : "bg-orange-500"
              }`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {type === "goals" || type === "owes" ? "Target" : "Due"}: {dueDate || "N/A"}
            </span>
            <span className="text-xs font-medium text-gray-700">
              Remaining: ৳{remaining.toFixed(2)}
            </span>
          </div>
          {percent < 100 ? (
            <button
              onClick={() => handlePay(item.id, paid, total, type)}
              className="w-full mt-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              {type === "goals" ? "+ Add Money" : type === "owes" ? "+ Received Payment" : "+ Make Payment"}
            </button>
          ) : (
            <div className="mt-2 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium text-center">
              ✓ {type === "goals" ? "Goal Achieved!" : type === "owes" ? "Fully Received" : "Fully Paid"}
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "goals" as TabType, label: "Goals", icon: Target, count: goals.length, color: "text-green-600" },
    { id: "loans" as TabType, label: "Loans", icon: TrendingDown, count: loans.length, color: "text-red-600" },
    { id: "debts" as TabType, label: "Debts", icon: TrendingDown, count: debts.length, color: "text-orange-600" },
    { id: "owes" as TabType, label: "Owes Me", icon: TrendingUp, count: owes.length, color: "text-blue-600" },
  ];

  const getItems = () => {
    switch (activeTab) {
      case "loans": return loans;
      case "debts": return debts;
      case "owes": return owes;
      case "goals": return goals;
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "loans": return { icon: TrendingDown, text: "No loans yet" };
      case "debts": return { icon: TrendingDown, text: "No debts yet" };
      case "owes": return { icon: User, text: "No one owes you money" };
      case "goals": return { icon: Target, text: "No savings goals yet" };
    }
  };

  const items = getItems();
  const empty = getEmptyMessage();

  return (
    <div className="space-y-4">
      {/* Financial Status Summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 text-gray-900">Financial Status Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-xl">
            <div className="text-xs text-green-700 mb-1">Goals Saved</div>
            <div className="text-lg font-bold text-green-800">৳{totalGoalsSaved.toFixed(0)} <span className="text-xs font-normal">/ ৳{totalGoals.toFixed(0)}</span></div>
            <div className="h-1.5 bg-green-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${totalGoals > 0 ? (totalGoalsSaved / totalGoals) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="p-3 bg-orange-50 rounded-xl">
            <div className="text-xs text-orange-700 mb-1">Loans Paid</div>
            <div className="text-lg font-bold text-orange-800">৳{totalLoansPaid.toFixed(0)} <span className="text-xs font-normal">/ ৳{totalLoans.toFixed(0)}</span></div>
            <div className="h-1.5 bg-orange-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${totalLoans > 0 ? (totalLoansPaid / totalLoans) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded-xl">
            <div className="text-xs text-red-700 mb-1">Debts Paid</div>
            <div className="text-lg font-bold text-red-800">৳{totalDebtsPaid.toFixed(0)} <span className="text-xs font-normal">/ ৳{totalDebts.toFixed(0)}</span></div>
            <div className="h-1.5 bg-red-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${totalDebts > 0 ? (totalDebtsPaid / totalDebts) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <div className="text-xs text-blue-700 mb-1">Owes Received</div>
            <div className="text-lg font-bold text-blue-800">৳{totalOwesReceived.toFixed(0)} <span className="text-xs font-normal">/ ৳{totalOwes.toFixed(0)}</span></div>
            <div className="h-1.5 bg-blue-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalOwes > 0 ? (totalOwesReceived / totalOwes) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-500">Total Outstanding</div>
            <div className="text-xl font-bold text-gray-900">
              ৳{((totalLoans - totalLoansPaid) + (totalDebts - totalDebtsPaid)).toFixed(0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Net Receivable</div>
            <div className="text-xl font-bold text-gray-900">
              ৳{(totalOwes - totalOwesReceived).toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white shadow-sm"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-medium">{tab.label}</div>
              <div className="text-xs opacity-75">{tab.count}</div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab === "owes" ? "Owe" : activeTab.slice(0, -1)}
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {(() => {
              const Icon = empty.icon;
              return <Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />;
            })()}
            <p>{empty.text}</p>
          </div>
        ) : (
          items.map((item) => renderItem(item, activeTab))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              Add {activeTab === "owes" ? "Owe" : activeTab.slice(0, -1)}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder={
                    activeTab === "goals"
                      ? "e.g., New Phone"
                      : activeTab === "owes"
                      ? "Person name"
                      : "Loan/Debt name"
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {activeTab === "goals" ? "Target Amount" : "Amount"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {activeTab === "goals" ? "Target Date" : "Due Date"}
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Add details..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setForm({ name: "", amount: "", dueDate: "", description: "" });
                  }}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
