import { db } from "@/db";
import { transactions } from "@/db/schema/transactions";
import { desc, eq, and, sql } from "drizzle-orm";
import { categories } from "@/db/schema/categories";
import TransactionList from "@/components/dashboard/TransactionList";
import { Search, Calendar, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { auth } from "@/../auth";
import { getOrCreateTenant } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export const revalidate = 0; // Disable cache to see immediate updates

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }
  const tenantId = await getOrCreateTenant(session.user.email);
  
  // O(1) in DB querying with left join
  const data = await db.select({
    id: transactions.id,
    tenantId: transactions.tenantId,
    type: transactions.type,
    amount: transactions.amount,
    description: transactions.description,
    categoryId: transactions.categoryId,
    status: transactions.status,
    createdAt: transactions.createdAt,
    categoryName: categories.description
  })
  .from(transactions)
  .leftJoin(categories, eq(transactions.categoryId, categories.id))
  .where(eq(transactions.tenantId, tenantId))
  .orderBy(desc(transactions.createdAt));
  
  // Aggregate stats
  let incomeCount = 0;
  let incomeTotal = 0;
  let expenseCount = 0;
  let expenseTotal = 0;
  
  data.forEach(t => {
    const val = parseFloat(t.amount);
    if (t.type === 'INCOME') {
      incomeCount++;
      incomeTotal += val;
    } else if (t.type === 'EXPENSE') {
      expenseCount++;
      expenseTotal += val;
    }
  });

  return (
    <div className="min-h-full flex flex-col p-5">
      {/* Header */}
      <header className="flex items-center justify-between py-2 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Cuenta Principal</span>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Mi Billetera</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      {/* Months Selector */}
      <div className="flex overflow-x-auto gap-3 mb-8 pb-2 no-scrollbar -mx-2 px-2">
        {["MAYO 2026", "JUNIO 2026", "JULIO 2026", "AGOSTO 2026"].map((m, i) => (
          <button key={m} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-colors ${i === 3 ? "bg-zinc-900 text-white shadow-md dark:bg-white dark:text-zinc-900 shadow-zinc-900/20" : "bg-transparent text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}>
            {m}
          </button>
        ))}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-900/50 rounded-[28px] p-5 border border-emerald-100 dark:border-emerald-900/30 shadow-sm shadow-emerald-100/50 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-emerald-600/70 dark:text-emerald-400/70 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">{incomeCount} mov</span>
          </div>
          <p className="text-sm font-semibold text-emerald-700/80 dark:text-emerald-300/80 mb-1">Ingresos</p>
          <h2 className="text-2xl font-bold tracking-tight text-emerald-800 dark:text-emerald-400 break-all">${incomeTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h2>
        </div>
        
        <div className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-zinc-900/50 rounded-[28px] p-5 border border-rose-100 dark:border-rose-900/30 shadow-sm shadow-rose-100/50 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-rose-600 dark:text-rose-400" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-rose-600/70 dark:text-rose-400/70 bg-rose-100/50 dark:bg-rose-900/30 px-2 py-1 rounded-full">{expenseCount} mov</span>
          </div>
          <p className="text-sm font-semibold text-rose-700/80 dark:text-rose-300/80 mb-1">Gastos</p>
          <h2 className="text-2xl font-bold tracking-tight text-rose-800 dark:text-rose-400 break-all">${expenseTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h2>
        </div>
      </div>
      
      {/* Transaction List */}
      <TransactionList data={data} />
    </div>
  )
}
