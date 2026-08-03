import { signIn } from "@/../auth";
import { ArrowRight, Sparkles, Wallet, BarChart3, Users, Smartphone } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 selection:text-white overflow-x-hidden">
      
      {/* NAVEGACIÓN PREMIUM */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 rotate-3">
            <Wallet className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="font-serif italic text-2xl tracking-tight text-white">Zero Friction</span>
            <div className="h-0.5 w-full bg-emerald-500/40 rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Ingresar
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="w-full min-h-[90vh] flex items-center pt-32 pb-16 relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center z-10">
            {/* Columna A: Copy & CTA */}
            <div className="space-y-12 lg:pr-6">
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  La Calculadora Inteligente
                </div>

                <h1 className="text-6xl sm:text-8xl font-serif italic text-white tracking-tighter leading-[0.9] decoration-emerald-500/30 underline-offset-8">
                  Finanzas de <br />
                  <span className="text-emerald-400">Cero Fricción</span> <br />
                  Para tu <span className="text-slate-600">Negocio.</span>
                </h1>

                <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
                  Registra ingresos, controla deudas por WhatsApp y obtén reportes con Inteligencia Artificial. Todo desde tu celular en 2 segundos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <form
                  action={async () => {
                    "use server";
                    await signIn("google");
                  }}
                  className="w-full sm:w-auto"
                >
                  <button
                    type="submit"
                    className="w-full bg-emerald-500 text-black px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1.5 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    Crear mi Cuenta Gratis <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Columna B: Showcase Móvil */}
            <div className="relative w-full aspect-[9/16] max-w-sm mx-auto flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <div className="absolute -inset-10 bg-black/60 rounded-[4rem] blur-[100px] -z-20 opacity-80" />
              
              <div className="relative w-full h-full rounded-[3rem] border-8 border-slate-900 bg-zinc-950 overflow-hidden shadow-[0_40px_100px_-20px_rgba(16,185,129,0.4)] ring-1 ring-white/10 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <Smartphone className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Diseño Mobile-First</h3>
                <p className="text-slate-400 text-sm">Siente el poder de una app nativa, operada desde tu navegador.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="w-full bg-[#080808] py-32 border-t border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                {
                  icon: Wallet,
                  title: "Calculadora Rápida",
                  desc: "Interfaz fluida para registrar transacciones mientras hablas con tu cliente. Sin formularios lentos.",
                  color: "from-emerald-500/20 to-transparent"
                },
                {
                  icon: Users,
                  title: "Fiados por WhatsApp",
                  desc: "Guarda el número de tu cliente, auto-completa su nombre y mándale un mensaje de cobro a un toque.",
                  color: "from-blue-500/20 to-transparent"
                },
                {
                  icon: BarChart3,
                  title: "IA Financiera",
                  desc: "Las transacciones se categorizan con Inteligencia Artificial generando reportes dinámicos.",
                  color: "from-purple-500/20 to-transparent"
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-start p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]`} />
                  <div className="w-14 h-14 bg-white/5 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-emerald-400 group-hover:text-black transition-all">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-serif italic text-white mb-4 relative">{feature.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed relative">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#050505] py-20 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Wallet className="w-8 h-8 text-emerald-500" />
          <span className="font-serif italic text-2xl">Zero Friction</span>
        </div>
        <p className="text-slate-600 text-xs uppercase tracking-[0.4em]">© 2026 Crafted for Small Businesses</p>
      </footer>
    </div>
  );
}
