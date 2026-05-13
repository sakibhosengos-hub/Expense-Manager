import { Trash2 } from "lucide-react";
import { getCategoryMap } from "../data/categories";
import type { Expense } from "../types";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    if (!acc[expense.date]) acc[expense.date] = [];
    acc[expense.date].push(expense);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="text-6xl mb-4">💸</div>
        <p className="text-lg">No expenses yet</p>
        <p className="text-sm">Tap the + button to add one</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">{formatDate(date)}</h3>
            <span className="text-sm text-gray-500">
              ৳{grouped[date].reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </span>
          </div>
          <div className="space-y-2">
            {grouped[date].map((expense) => {
              const map = getCategoryMap();
              const cat = map[expense.category] || map.other;
              return (
                <div
                  key={expense.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
                >
                  <div
                    className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}
                  >
                    {cat.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{cat.name}</div>
                    {expense.description && (
                      <div className="text-sm text-gray-500 truncate">{expense.description}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-lg text-gray-900">
                      ৳{expense.amount.toFixed(2)}
                    </div>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
