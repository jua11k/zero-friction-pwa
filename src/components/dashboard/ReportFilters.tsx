"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function ReportFilters({ categories }: { categories: { id: string; description: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = searchParams.get("month") || new Date().toISOString().slice(0, 7);
  const currentCategory = searchParams.get("category") || "";
  const currentType = searchParams.get("type") || "";

  const [month, setMonth] = useState(currentMonth);
  const [category, setCategory] = useState(currentCategory);
  const [type, setType] = useState(currentType);

  const applyFilters = useCallback((newMonth: string, newCategory: string, newType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newMonth) params.set("month", newMonth);
    else params.delete("month");
    
    if (newCategory) params.set("category", newCategory);
    else params.delete("category");
    
    if (newType) params.set("type", newType);
    else params.delete("type");

    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="bg-white dark:bg-zinc-900/50 p-4 rounded-[20px] shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-xs font-semibold text-zinc-500 mb-1">Mes</label>
        <input 
          type="month" 
          value={month} 
          onChange={(e) => {
            setMonth(e.target.value);
            applyFilters(e.target.value, category, type);
          }}
          className="p-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm w-full"
        />
      </div>

      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-xs font-semibold text-zinc-500 mb-1">Categoría</label>
        <select 
          value={category} 
          onChange={(e) => {
            setCategory(e.target.value);
            applyFilters(month, e.target.value, type);
          }}
          className="p-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm w-full"
        >
          <option value="">Todas</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.description}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-xs font-semibold text-zinc-500 mb-1">Tipo</label>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button 
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${type === "" ? "bg-white dark:bg-zinc-700 shadow-sm font-semibold" : "text-zinc-500"}`}
            onClick={() => { setType(""); applyFilters(month, category, ""); }}
          >
            Ambos
          </button>
          <button 
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${type === "INCOME" ? "bg-emerald-500 text-white font-semibold" : "text-zinc-500"}`}
            onClick={() => { setType("INCOME"); applyFilters(month, category, "INCOME"); }}
          >
            Ingresos
          </button>
          <button 
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${type === "EXPENSE" ? "bg-rose-500 text-white font-semibold" : "text-zinc-500"}`}
            onClick={() => { setType("EXPENSE"); applyFilters(month, category, "EXPENSE"); }}
          >
            Egresos
          </button>
        </div>
      </div>
    </div>
  );
}
