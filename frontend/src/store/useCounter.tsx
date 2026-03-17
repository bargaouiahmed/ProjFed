import { create } from "zustand";

type Counter = {
  count: number;
  inc: () => void;
};

export const useCounter = create<Counter>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));
