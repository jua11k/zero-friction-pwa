import { create } from 'zustand';

interface KeyboardState {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useKeyboardStore = create<KeyboardState>((set) => ({
  isOpen: false,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
}));
