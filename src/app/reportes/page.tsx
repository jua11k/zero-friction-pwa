import { BarChart2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReportesPage() {
  return (
    <div className="min-h-full flex flex-col p-5">
      <header className="flex items-center gap-4 py-2 mb-6">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Reportes</h1>
          <span className="text-xs text-zinc-500 font-medium tracking-wide">Analítica financiera</span>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <BarChart2 className="w-10 h-10 text-zinc-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Próximamente</h2>
        <p className="text-zinc-500 max-w-xs mx-auto text-sm">
          Estamos construyendo la inteligencia artificial para generar gráficos y reportes automáticos basados en tus transacciones.
        </p>
      </div>
    </div>
  );
}
