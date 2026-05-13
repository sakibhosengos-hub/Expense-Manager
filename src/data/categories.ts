import type { CategoryDef } from "../types";

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { id: "food", name: "Food", emoji: "🍔", color: "bg-orange-500", hex: "#f97316" },
  { id: "transport", name: "Transport", emoji: "🚗", color: "bg-blue-500", hex: "#3b82f6" },
  { id: "shopping", name: "Shopping", emoji: "🛍️", color: "bg-pink-500", hex: "#ec4899" },
  { id: "entertainment", name: "Entertainment", emoji: "🎬", color: "bg-purple-500", hex: "#a855f7" },
  { id: "bills", name: "Bills", emoji: "💳", color: "bg-red-500", hex: "#ef4444" },
  { id: "health", name: "Health", emoji: "⚕️", color: "bg-green-500", hex: "#22c55e" },
  { id: "home rent", name: "Home Rent", emoji: "🏠", color: "bg-gray-500", hex: "#6b7280" },
  { id: "other", name: "Other", emoji: "📝", color: "bg-gray-500", hex: "#6b7280" },
];

const COLORS = [
  { color: "bg-orange-500", hex: "#f97316" },
  { color: "bg-blue-500", hex: "#3b82f6" },
  { color: "bg-pink-500", hex: "#ec4899" },
  { color: "bg-purple-500", hex: "#a855f7" },
  { color: "bg-red-500", hex: "#ef4444" },
  { color: "bg-green-500", hex: "#22c55e" },
  { color: "bg-teal-500", hex: "#14b8a6" },
  { color: "bg-indigo-500", hex: "#6366f1" },
  { color: "bg-yellow-500", hex: "#eab308" },
  { color: "bg-cyan-500", hex: "#06b6d4" },
];

export function getCategories(): CategoryDef[] {
  const saved = localStorage.getItem("custom_categories");
  const custom: CategoryDef[] = saved ? JSON.parse(saved) : [];
  return [...DEFAULT_CATEGORIES, ...custom];
}

export function addCustomCategory(name: string, emoji: string): CategoryDef {
  const categories = getCategories();
  const id = "custom_" + Date.now();
  const colorIndex = categories.length % COLORS.length;
  const newCat: CategoryDef = {
    id,
    name,
    emoji,
    color: COLORS[colorIndex].color,
    hex: COLORS[colorIndex].hex,
  };
  const saved = localStorage.getItem("custom_categories");
  const custom: CategoryDef[] = saved ? JSON.parse(saved) : [];
  localStorage.setItem("custom_categories", JSON.stringify([...custom, newCat]));
  return newCat;
}

export function getCategoryMap(): Record<string, CategoryDef> {
  const map: Record<string, CategoryDef> = {};
  getCategories().forEach((cat) => {
    map[cat.id] = cat;
  });
  return map;
}
