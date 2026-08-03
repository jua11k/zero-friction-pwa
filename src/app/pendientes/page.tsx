import { db } from "@/db";
import { debts } from "@/db/schema/debts";
import { customers } from "@/db/schema/customers";
import { desc, eq } from "drizzle-orm";
import { Users, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const revalidate = 0;

export default async function PendientesPage() {
  const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000000";
  
  const data = await db.select({
    id: debts.id,
    amount: debts.amount,
    description: debts.description,
    status: debts.status,
    createdAt: debts.createdAt,
    customerName: customers.name,
    customerPhone: customers.phone,
  })
    .from(debts)
    .leftJoin(customers, eq(debts.customerId, customers.id))
    .where(eq(debts.tenantId, MOCK_TENANT_ID))
    .orderBy(desc(debts.createdAt));

  const totalDeuda = data.filter(d => d.status === "PENDING").reduce((acc, d) => acc + parseFloat(d.amount), 0);
  const pendientesCount = data.filter(d => d.status === "PENDING").length;

  return (
    <div className="min-h-full flex flex-col p-5 pb-24">
      <header className="flex items-center gap-4 py-2 mb-6">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Pendientes</h1>
          <span className="text-xs text-zinc-500 font-medium tracking-wide">Cuentas por cobrar</span>
        </div>
      </header>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-zinc-900/50 rounded-[28px] p-6 border border-amber-100 dark:border-amber-900/30 mb-8 shadow-sm shadow-amber-100/50 dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-amber-600/70 dark:text-amber-400/70 bg-amber-100/50 dark:bg-amber-900/30 px-3 py-1.5 rounded-full">{pendientesCount} registros</span>
        </div>
        <p className="text-sm font-semibold text-amber-700/80 dark:text-amber-300/80 mb-1">Total por cobrar</p>
        <h2 className="text-3xl font-bold tracking-tight text-amber-800 dark:text-amber-400 break-all">${totalDeuda.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h2>
      </div>

      <div className="flex flex-col gap-4">
        {data.map(debt => {
          const isPending = debt.status === "PENDING";
          const parsedPhone = debt.customerPhone?.replace(/\D/g,'') || "";
          // Format whatsapp link with the parsed phone
          const wpMessage = encodeURIComponent(`Hola ${debt.customerName}, te escribo para recordarte el pago pendiente de $${parseFloat(debt.amount).toLocaleString()} por concepto de: ${debt.description || 'Fiado'}. ¡Gracias!`);
          const wpLink = `https://wa.me/${parsedPhone}?text=${wpMessage}`;

          return (
            <div key={debt.id} className="flex flex-col bg-white dark:bg-zinc-900/50 p-5 rounded-[20px] shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{debt.customerName || "Desconocido"}</h3>
                  <span className="text-sm text-zinc-500">{debt.description || "Sin detalle"} • {format(new Date(debt.createdAt), "dd MMM", { locale: es })}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-lg text-amber-500">${parseFloat(debt.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mt-1 ${isPending ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    {isPending ? 'Pendiente' : 'Pagado'}
                  </span>
                </div>
              </div>

              {isPending && debt.customerPhone && (
                <div className="flex gap-3 mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <a href={wpLink} target="_blank" rel="noopener noreferrer" className="flex-1 h-11 flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-semibold rounded-xl transition-colors">
                    <Phone className="w-4 h-4" />
                    Cobrar por WhatsApp
                  </a>
                </div>
              )}
            </div>
          )
        })}
        {data.length === 0 && (
          <div className="text-center py-10 text-zinc-400">No hay deudas registradas</div>
        )}
      </div>
    </div>
  )
}

