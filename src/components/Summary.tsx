import { ArrowRight, Calendar, TrendingDown, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getCategoryMap } from "../data/categories";
import type { Expense } from "../types";

interface SummaryProps {
  expenses: Expense[];
}

export default function Summary({ expenses }: SummaryProps) {
  const today = new Date();
  const todayStr = today.toDateString();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 7);
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(lastWeekStart.getDate() - 14);

  const thisWeekExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= weekStart && d <= today;
  });
  const lastWeekExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= lastWeekStart && d < weekStart;
  });
  const thisWeekTotal = thisWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastWeekTotal = lastWeekExpenses.reduce((sum, e) => sum + e.amount, 0);

  const thisMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
  });
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const todayTotal = expenses
    .filter((e) => new Date(e.date).toDateString() === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  const yesterdayTotal = expenses
    .filter((e) => new Date(e.date).toDateString() === yesterdayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  // dayBeforeTotal removed - not needed

  const todayDiff = todayTotal - yesterdayTotal;
  const todayPercent = yesterdayTotal > 0 ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 : 0;

  const weekDiff = thisWeekTotal - lastWeekTotal;
  const weekPercent = lastWeekTotal > 0 ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 : 0;

  const monthDiff = thisMonthTotal - lastMonthTotal;
  const monthPercent = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  const topExpenses = [...thisMonthExpenses].sort((a, b) => b.amount - a.amount).slice(0, 5);

  const map = getCategoryMap();
  const categoryData = Object.entries(
    thisMonthExpenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {})
  )
    .map(([catId, value]) => {
      const cat = map[catId] || map.other;
      return { name: cat.name, value, color: cat.hex, emoji: cat.emoji };
    })
    .filter((d) => d.value > 0);

  const renderPieLabel = (props: { name?: string; percent?: number }) =>
    `${props.name ?? ""}: ${((props.percent ?? 0) * 100).toFixed(0)}%`;

  return (
    <div className="space-y-4">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <Calendar className="w-5 h-5 mb-2 opacity-80" />
          <div className="text-2xl font-bold">৳{todayTotal.toFixed(0)}</div>
          <div className="text-xs opacity-90">Today</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
          <TrendingUp className="w-5 h-5 mb-2 opacity-80" />
          <div className="text-2xl font-bold">৳{thisWeekTotal.toFixed(0)}</div>
          <div className="text-xs opacity-90">This Week</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-4 text-white">
          <Calendar className="w-5 h-5 mb-2 opacity-80" />
          <div className="text-2xl font-bold">৳{thisMonthTotal.toFixed(0)}</div>
          <div className="text-xs opacity-90">This Month</div>
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 text-gray-900">Comparison</h3>
        <div className="space-y-4">
          {/* Today vs Yesterday */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Today vs Yesterday</div>
              <div className="flex items-center gap-3">
                <div className="font-bold text-lg text-gray-900">৳{todayTotal.toFixed(2)}</div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="text-sm text-gray-500">৳{yesterdayTotal.toFixed(2)}</div>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                todayDiff > 0
                  ? "bg-red-100 text-red-700"
                  : todayDiff < 0
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {todayDiff > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : todayDiff < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
              {Math.abs(todayPercent).toFixed(1)}%
            </div>
          </div>

          {/* This Week vs Last Week */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">This Week vs Last Week</div>
              <div className="flex items-center gap-3">
                <div className="font-bold text-lg text-gray-900">৳{thisWeekTotal.toFixed(2)}</div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="text-sm text-gray-500">৳{lastWeekTotal.toFixed(2)}</div>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                weekDiff > 0
                  ? "bg-red-100 text-red-700"
                  : weekDiff < 0
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {weekDiff > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : weekDiff < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
              {Math.abs(weekPercent).toFixed(1)}%
            </div>
          </div>

          {/* This Month vs Last Month */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">This Month vs Last Month</div>
              <div className="flex items-center gap-3">
                <div className="font-bold text-lg text-gray-900">৳{thisMonthTotal.toFixed(2)}</div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="text-sm text-gray-500">৳{lastMonthTotal.toFixed(2)}</div>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                monthDiff > 0
                  ? "bg-red-100 text-red-700"
                  : monthDiff < 0
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {monthDiff > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : monthDiff < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
              {Math.abs(monthPercent).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Top Expenses */}
      {topExpenses.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-900">Top Expenses This Month</h3>
          <div className="space-y-3">
            {topExpenses.map((expense) => {
              const cat = map[expense.category] || map.other;
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center text-xl`}
                    >
                      {cat.emoji}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{cat.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">৳{expense.amount.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Spending by Category */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-900">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderPieLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `৳${Number(value).toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs text-gray-600">
                  {cat.emoji} {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Categories This Month */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-900">Top Categories This Month</h3>
          <div className="space-y-4">
            {categoryData
              .sort((a, b) => b.value - a.value)
              .map((cat) => {
                const percent = thisMonthTotal > 0 ? (cat.value / thisMonthTotal) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.emoji}</span>
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        ৳{cat.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {expenses.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3 text-gray-900">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">{thisMonthExpenses.length}</div>
              <div className="text-sm text-gray-500">Transactions this month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ৳{thisMonthExpenses.length > 0 ? (thisMonthTotal / thisMonthExpenses.length).toFixed(2) : "0.00"}
              </div>
              <div className="text-sm text-gray-500">Average per transaction</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
