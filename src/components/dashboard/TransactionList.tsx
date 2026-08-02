"use client";

import { useMemo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";
import { Coffee, ShoppingCart, Activity, FileText, Wrench, MoreHorizontal, TrendingUp, HandCoins } from "lucide-react";

export default function TransactionList({ data }: { data: any[] }) {
  // O(1) grouping with Map
  const { grouped, sortedKeys } = useMemo(() => {
    const map = new Map<string, any[]>();
    data.forEach(tx => {
      // Use date string as key
      const dateObj = new Date(tx.createdAt);
      const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      
      const items = map.get(dateKey) || [];
      items.push(tx);
      map.set(dateKey, items);
    });
    
    // Sort keys descending (newest first)
    const keys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    return { grouped: map, sortedKeys: keys };
  }, [data]);
  
  const getIcon = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case "proveedores": return <ShoppingCart className="w-5 h-5 text-zinc-500" />;
      case "servicios": return <Activity className="w-5 h-5 text-zinc-500" />;
      case "transporte": return <Coffee className="w-5 h-5 text-zinc-500" />;
      case "nómina": return <FileText className="w-5 h-5 text-zinc-500" />;
      case "impuestos": return <FileText className="w-5 h-5 text-zinc-500" />;
      case "mantenimiento": return <Wrench className="w-5 h-5 text-zinc-500" />;
      case "venta de producto": return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "servicios prestados": return <HandCoins className="w-5 h-5 text-emerald-500" />;
      default: return <MoreHorizontal className="w-5 h-5 text-zinc-500" />;
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      {sortedKeys.map(key => {
        const items = grouped.get(key) || [];
        // parse key YYYY-MM-DD manually to avoid timezone shifts
        const [y, m, d] = key.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        
        let dateLabel = format(date, "dd MMMM", { locale: es });
        if (isToday(date)) dateLabel = "Hoy";
        else if (isYesterday(date)) dateLabel = "Ayer";
        
        const netDay = items.reduce((acc, tx) => {
           return acc + (tx.type === "INCOME" ? parseFloat(tx.amount) : -parseFloat(tx.amount));
        }, 0);

        return (
          <div key={key} className="flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{dateLabel}</h3>
              <span className={`text-xs font-semibold ${netDay >= 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                {netDay >= 0 ? '+' : ''}{netDay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {items.map(tx => (
                <div key={tx.id} className="flex items-center justify-between bg-white dark:bg-zinc-900/50 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {getIcon(tx.aiCategory)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px]">{tx.description}</span>
                      <span className="text-xs text-zinc-400 capitalize">{tx.aiCategory || "Pendiente"} • {format(new Date(tx.createdAt), "HH:mm")}</span>
                    </div>
                  </div>
                  <div className={`font-semibold tracking-tight ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'} ${parseFloat(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  )
}
