"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createTransactionAction } from "@/actions/transaction.actions";
import { Loader2 } from "lucide-react";

export default function TecladoPage() {
  const [amount, setAmount] = useState("0");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNumber = (num: string) => {
    setAmount((prev) => (prev === "0" ? num : prev + num));
  };

  const handleBackspace = () => {
    setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const submitTransaction = async (type: "INCOME" | "EXPENSE") => {
    if (amount === "0") {
      toast.error("Ingresa un monto válido");
      return;
    }
    if (!description.trim()) {
      toast.error("La descripción es requerida");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("description", description);
    formData.append("type", type);

    const res = await createTransactionAction(formData);
    
    if (res.success) {
      toast.success(type === "INCOME" ? "Ingreso registrado" : "Egreso registrado");
      setAmount("0");
      setDescription("");
    } else {
      toast.error(res.error || "Error al registrar la transacción");
    }
    setLoading(false);
  };

  return (
    <main className="flex w-full min-h-[100dvh] flex-col bg-background p-4 justify-between" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      
      {/* Display */}
      <div className="flex flex-col flex-1 justify-center space-y-4">
        <div className="text-right">
          <span className="text-6xl font-bold tracking-tighter text-foreground">${amount}</span>
        </div>
        
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={50}
          placeholder="¿En qué fue? (ej. Café)"
          className="w-full text-center text-lg bg-muted border-none h-14 rounded-xl px-4 focus:ring-2 focus:ring-primary outline-none"
          disabled={loading}
        />
      </div>

      {/* Keyboard */}
      <div className="grid grid-cols-3 gap-2 mt-auto pb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumber(num.toString())}
            disabled={loading}
            className="h-16 text-2xl font-semibold bg-secondary text-secondary-foreground rounded-xl active:scale-95 transition-transform"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumber("00")}
          disabled={loading}
          className="h-16 text-2xl font-semibold bg-secondary text-secondary-foreground rounded-xl active:scale-95 transition-transform"
        >
          00
        </button>
        <button
          onClick={() => handleNumber("0")}
          disabled={loading}
          className="h-16 text-2xl font-semibold bg-secondary text-secondary-foreground rounded-xl active:scale-95 transition-transform"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          disabled={loading}
          className="h-16 text-2xl font-semibold bg-secondary text-secondary-foreground rounded-xl active:scale-95 transition-transform flex items-center justify-center"
        >
          ⌫
        </button>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => submitTransaction("EXPENSE")}
          disabled={loading}
          className="h-14 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "- Egreso"}
        </button>
        <button
          onClick={() => submitTransaction("INCOME")}
          disabled={loading}
          className="h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "+ Ingreso"}
        </button>
      </div>

    </main>
  );
}
