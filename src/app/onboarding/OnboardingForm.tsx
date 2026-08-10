"use client";

import { useState } from "react";
import { setupTenantProfile } from "@/actions/tenant.actions";
import { Store, Scissors, Briefcase, ChevronRight, Loader2 } from "lucide-react";

type BusinessType = {
  id: string;
  name: string;
  description: string | null;
};

export default function OnboardingForm({
  businessTypes,
}: {
  businessTypes: BusinessType[];
}) {
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const isFormValid = name.trim().length > 0 && selectedType !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    try {
      await setupTenantProfile(name, selectedType);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("restaurante")) return <Store className="w-6 h-6" />;
    if (name.toLowerCase().includes("tienda")) return <Store className="w-6 h-6" />;
    if (name.toLowerCase().includes("servicios")) return <Scissors className="w-6 h-6" />;
    return <Briefcase className="w-6 h-6" />;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Nombre del Negocio */}
      <div className="space-y-3">
        <label htmlFor="name" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Nombre del negocio
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Mi Tienda"
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
          required
        />
      </div>

      {/* Tipo de Negocio */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Tipo de negocio
        </label>
        <div className="grid gap-3">
          {businessTypes.map((type) => (
            <label
              key={type.id}
              className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all ${
                selectedType === type.id
                  ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-900 ring-1 ring-black dark:ring-white"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              <input
                type="radio"
                name="businessType"
                value={type.id}
                checked={selectedType === type.id}
                onChange={() => setSelectedType(type.id)}
                className="sr-only"
                required
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    {getIcon(type.name)}
                    {type.name}
                  </span>
                  {type.description && (
                    <span className="mt-1 flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                      {type.description}
                    </span>
                  )}
                </span>
              </span>
              <span
                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  selectedType === type.id
                    ? "border-black bg-black dark:border-white dark:bg-white"
                    : "border-zinc-300 dark:border-zinc-700 bg-transparent"
                }`}
              >
                {selectedType === type.id && (
                  <span className="h-2 w-2 rounded-full bg-white dark:bg-black" />
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || loading}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Finalizar configuración
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
