import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { transactions } from "@/db/schema/transactions";
import { desc, eq, isNotNull } from "drizzle-orm";
import { categories } from "@/db/schema/categories";
import ReportCharts from "@/components/dashboard/ReportCharts";
import { auth } from "@/../auth";
import { getOrCreateTenant } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ReportesPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }
  const tenantId = await getOrCreateTenant(session.user.email);
  
  // Obtener todas las transacciones categorizadas
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

  return (
    <div className="min-h-full flex flex-col p-5">
      <header className="flex items-center gap-4 py-2 mb-6">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Reportes</h1>
          <span className="text-xs text-zinc-500 font-medium tracking-wide">Analítica financiera IA</span>
        </div>
      </header>

      {data.length > 0 ? (
        <ReportCharts data={data} />
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Sin datos suficientes</h2>
          <p className="text-zinc-500 max-w-xs mx-auto text-sm">
            Registra tus primeros ingresos y egresos para que la IA empiece a generar tus reportes analíticos.
          </p>
        </div>
      )}
    </div>
  );
}
