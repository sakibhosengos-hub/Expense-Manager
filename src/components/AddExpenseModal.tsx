import { useState } from "react";
import { Plus, X } from "lucide-react";
import { getCategories, addCustomCategory } from "../data/categories";
import type { Expense, CategoryDef } from "../types";

interface AddExpenseModalProps {
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  onClose: () => void;
}

export default function AddExpenseModal({ onAddExpense, onClose }: AddExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmoji, setCustomEmoji] = useState("");
  const [categories, setCategories] = useState<CategoryDef[]>(getCategories());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    onAddExpense({
      amount: parseFloat(amount),
      category,
      description,
      date,
    });
    onClose();
  };

  const handleAddCustom = () => {
    if (!customName.trim() || !customEmoji.trim()) return;
    const newCat = addCustomCategory(customName.trim(), customEmoji.trim());
    setCategories(getCategories());
    setCategory(newCat.id);
    setShowCustom(false);
    setCustomName("");
    setCustomEmoji("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Add Expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">৳</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">Category</label>
              <button
                type="button"
                onClick={() => setShowCustom(!showCustom)}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                {showCustom ? "Cancel" : "+ Add Custom"}
              </button>
            </div>
            {showCustom && (
              <div className="mb-3 p-3 bg-gray-50 rounded-xl space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    className="w-14 px-2 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center text-lg"
                    placeholder="😀"
                    maxLength={2}
                  />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Category name"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustom}
                  disabled={!customName.trim() || !customEmoji.trim()}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                >
                  Add Category
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat: CategoryDef) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                    category === cat.id
                      ? `${cat.color} border-transparent text-white`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="What did you buy?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!amount || !category}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
