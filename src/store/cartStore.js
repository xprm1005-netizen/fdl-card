import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (card, unitPrice) => {
        const items = get().items;
        const exists = items.find((i) => i.cardId === card.id);
        if (exists) {
          set({ items: items.map((i) => i.cardId === card.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { cardId: card.id, card, quantity: 1, unitPrice }] });
        }
      },

      removeItem: (cardId) => set({ items: get().items.filter((i) => i.cardId !== cardId) }),

      updateQuantity: (cardId, quantity) => {
        if (quantity < 1) return;
        set({ items: get().items.map((i) => i.cardId === cardId ? { ...i, quantity } : i) });
      },

      clear: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'fdl-cart' }
  )
);
