import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { transactions } from "@/db/schema/transactions";
import { desc, eq, and, gte, lte } from "drizzle-orm";
import { categories } from "@/db/schema/categories";
import ReportCharts from "@/components/dashboard/ReportCharts";
import ReportFilters from "@/components/dashboard/ReportFilters";
import { auth } from "@/../auth";
import { getOrCreateTenant } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ReportesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }
  const tenantId = await getOrCreateTenant(session.user.email);
  
  // Extraer parámetros de búsqueda (Next.js 16+ asincrónico)
  const params = await searchParams;
  
  // Por defecto, mes actual si no hay nada seleccionado
  const monthParam = params.month || new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const startOfMonth = new Date(`${monthParam}-01T00:00:00.000Z`);
  
  // Fin de mes (sumar 1 mes, restar 1 milisegundo)
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1);
  endOfMonth.setUTCMilliseconds(-1);

  // Construir condiciones dinámicas
  const conditions = [
    eq(transactions.tenantId, tenantId),
    gte(transactions.createdAt, startOfMonth),
    lte(transactions.createdAt, endOfMonth)
  ];

  if (params.category) {
    conditions.push(eq(transactions.categoryId, params.category));
  }

  if (params.type && (params.type === "INCOME" || params.type === "EXPENSE")) {
    conditions.push(eq(transactions.type, params.type));
  }
  
  // Obtener categorías para el filtro
  const tenant = await db.query.tenants.findFirst({
    where: (t, { eq }) => eq(t.id, tenantId)
  });
  
  let tenantCategories: any[] = [];
  if (tenant?.businessTypeId) {
    tenantCategories = await db.select({ id: categories.id, description: categories.description })
      .from(categories)
      .where(eq(categories.businessTypeId, tenant.businessTypeId))
      .orderBy(categories.description);
  }

  // Obtener transacciones filtradas de forma eficiente
  const rawData = await db.select({
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
    .where(and(...conditions))
    .orderBy(desc(transactions.createdAt));

  const data = rawData.map(d => ({
    ...d,
    createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt)
  }));

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
      
      <ReportFilters categories={tenantCategories} />

      {data.length > 0 ? (
        <ReportCharts data={data} />
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Sin datos suficientes</h2>
          <p className="text-zinc-500 max-w-xs mx-auto text-sm">
            No hay transacciones registradas para los filtros actuales.
          </p>
        </div>
      )}
    </div>
  );
}
