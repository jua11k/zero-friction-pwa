"use client";

import { Drawer } from "vaul";
import { useKeyboardStore } from "@/store/useKeyboardStore";
import { useState } from "react";
import { createTransactionAction } from "@/actions/transaction.actions";
import { createDebtAction } from "@/actions/debt.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function KeyboardDrawer() {
  const { isOpen, closeDrawer } = useKeyboardStore();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (val: string) => {
    if (val === "C") {
      setAmount("");
      return;
    }
    if (val === "<") {
      setAmount((prev) => prev.slice(0, -1));
      return;
    }
    
    // Max 10 digits
    if (amount.length >= 10) return;
    
    // Only one decimal dot
    if (val === "." && amount.includes(".")) return;
    
    setAmount((prev) => prev + val);
  };

  const handleSubmit = async (type: "INCOME" | "EXPENSE") => {
    if (!amount) {
      toast.error("Ingresa un monto");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("description", description || "Rápido");
    formData.append("type", type);

    const res = await createTransactionAction(formData);
    setLoading(false);

    if (res?.success) {
      toast.success(type === "INCOME" ? "Ingreso guardado" : "Egreso guardado");
      setAmount("");
      setDescription("");
      closeDrawer();
    } else {
      toast.error(res?.error || "Error al guardar");
    }
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
        <Drawer.Content className="bg-zinc-50 dark:bg-zinc-950 flex flex-col rounded-t-3xl h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          {/* Handle */}
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-t-3xl flex-1 flex flex-col shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-6" />

            {/* Display Area */}
            <div className="flex flex-col items-center mb-6 px-4">
              <span className="text-zinc-500 font-medium uppercase tracking-widest text-xs mb-2">Total</span>
              <div className="text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white break-all mb-4">
                ${amount || "0"}
              </div>
              <input
                type="text"
                maxLength={50}
                placeholder="¿En qué fue? (ej. Café)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-center text-lg bg-zinc-100 dark:bg-zinc-800 border-none h-14 rounded-2xl px-4 focus:ring-2 focus:ring-primary outline-none text-zinc-800 dark:text-zinc-200"
                disabled={loading}
              />
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3 mb-6 px-4 flex-1 content-center">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "<"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className="h-16 text-2xl font-medium bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 active:scale-95 transition-transform text-zinc-800 dark:text-zinc-200 flex items-center justify-center"
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3 px-4 pb-[env(safe-area-inset-bottom)]">
              <button
                onClick={() => handleSubmit("INCOME")}
                disabled={loading}
                className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform text-[13px]"
              >
                + Ingreso
              </button>
              <button
                onClick={() => handleSubmit("EXPENSE")}
                disabled={loading}
                className="h-14 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl shadow-lg shadow-rose-500/20 active:scale-95 transition-transform text-[13px]"
              >
                - Egreso
              </button>
              <button
                onClick={async () => {
                  if (!amount || !description) return toast.error("Ingresa monto y nombre");
                  setLoading(true);
                  const fd = new FormData();
                  fd.append("amount", amount);
                  fd.append("debtorName", description);
                  fd.append("description", "Fiado rápido");
                  
                  const res = await createDebtAction(fd);
                  setLoading(false);
                  if (res?.success) {
                    toast.success("Pendiente guardado");
                    setAmount(""); setDescription(""); closeDrawer();
                  } else toast.error(res?.error || "Error al guardar");
                }}
                disabled={loading}
                className="h-14 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-transform text-[13px]"
              >
                Fiado
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
