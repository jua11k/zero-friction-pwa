"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Plus, BarChart2, Settings } from "lucide-react";
import { useKeyboardStore } from "@/store/useKeyboardStore";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const pathname = usePathname();
  const openDrawer = useKeyboardStore((state) => state.openDrawer);

  const tabs = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Pendientes", href: "/pendientes", icon: Users },
  ];

  const tabsRight = [
    { name: "Reportes", href: "/reportes", icon: BarChart2 },
    { name: "Ajustes", href: "/ajustes", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-[64px] bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 pb-[env(safe-area-inset-bottom)] z-40">
      {/* Left Tabs */}
      <div className="flex w-2/5 justify-between">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-12 gap-1 transition-colors",
                isActive ? "text-primary font-medium" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] leading-none">{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Center FAB */}
      <div className="relative -top-5 flex justify-center w-1/5">
        <button
          onClick={openDrawer}
          className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 transform transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
        >
          <Plus className="w-7 h-7" strokeWidth={3} />
        </button>
      </div>

      {/* Right Tabs */}
      <div className="flex w-2/5 justify-between">
        {tabsRight.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-12 gap-1 transition-colors",
                isActive ? "text-primary font-medium" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] leading-none">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
