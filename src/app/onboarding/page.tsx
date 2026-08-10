import { db } from "@/db";
import { businessTypes } from "@/db/schema/business_types";
import OnboardingForm from "./OnboardingForm";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { getTenantProfile } from "@/lib/auth-helpers";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Verificar si ya está configurado para no dejarlo aquí
  const tenant = await getTenantProfile(session.user.email);
  if (tenant && tenant.name && tenant.name.trim() !== "" && tenant.businessTypeId !== null) {
    redirect("/");
  }

  const types = await db.select().from(businessTypes).orderBy(businessTypes.name);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 p-8 rounded-[32px] shadow-sm border border-zinc-100 dark:border-zinc-900">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 3.82-13.04A2.08 2.08 0 0 1 15 2.5a2.08 2.08 0 0 1 1.77 1.48 22 22 0 0 1-13.04 3.82l-3 3"/><path d="M9 11.5 12 15"/><path d="m11.5 9 3 3"/><circle cx="15.5" cy="8.5" r="2.5"/></svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
            ¡Bienvenido!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Configuremos tu negocio para empezar a llevar tus cuentas sin fricción.
          </p>
        </div>

        <OnboardingForm businessTypes={types} />
      </div>
    </div>
  );
}
