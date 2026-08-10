"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: string;
  categoryName: string | null;
  createdAt: string;
}

export default function ReportCharts({ data }: { data: Transaction[] }) {
  // 1. Torta: Ingresos vs Egresos
  const totalIncome = data.filter(t => t.type === "INCOME").reduce((acc, t) => acc + parseFloat(t.amount), 0);
  const totalExpense = data.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + parseFloat(t.amount), 0);
  const pieData = [
    { name: "Ingresos", value: totalIncome, color: "#10b981" },
    { name: "Egresos", value: totalExpense, color: "#f43f5e" }
  ].filter(d => d.value > 0);

  // Agrupador por categoría
  const groupByCategory = (type: "INCOME" | "EXPENSE") => {
    const grouped = data.filter(t => t.type === type).reduce((acc, t) => {
      const cat = t.categoryName || "Sin Categoría";
      acc[cat] = (acc[cat] || 0) + parseFloat(t.amount);
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const incomeCategories = groupByCategory("INCOME");
  const expenseCategories = groupByCategory("EXPENSE");

  // Agrupador por fecha para línea
  const groupedByDate = data.reduce((acc, t) => {
    const dateStr = new Date(t.createdAt).toISOString().split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = { date: dateStr, INCOME: 0, EXPENSE: 0 };
    acc[dateStr][t.type] += parseFloat(t.amount);
    return acc;
  }, {} as Record<string, { date: string, INCOME: number, EXPENSE: number }>);
  
  const lineData = Object.values(groupedByDate).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="flex flex-col gap-6 pb-24">
      
      {/* 1. Torta */}
      <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-[20px] shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h3 className="font-bold text-lg mb-4 text-zinc-900 dark:text-zinc-100 text-center">Balance General</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={pieData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Barras: Ingresos por Categoría */}
      <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-[20px] shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h3 className="font-bold text-lg mb-4 text-emerald-600 dark:text-emerald-400">Ingresos por Categoría</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeCategories} layout="vertical" margin={{ left: 40, right: 40 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#10b981', fontSize: 12, formatter: (val: number) => `$${val.toLocaleString()}` }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Barras: Egresos por Categoría */}
      <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-[20px] shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h3 className="font-bold text-lg mb-4 text-rose-600 dark:text-rose-400">Egresos por Categoría</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseCategories} layout="vertical" margin={{ left: 40, right: 40 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#f43f5e', fontSize: 12, formatter: (val: number) => `$${val.toLocaleString()}` }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Líneas: Tendencia Histórica */}
      <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-[20px] shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h3 className="font-bold text-lg mb-4 text-zinc-900 dark:text-zinc-100 text-center">Tendencia Histórica</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis hide />
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
              <Legend />
              <Line type="monotone" name="Ingresos" dataKey="INCOME" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              <Line type="monotone" name="Egresos" dataKey="EXPENSE" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
