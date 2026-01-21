import { create } from "zustand";
import { MenuItem, CreateMenuInput, UpdateMenuInput } from "@shared/api";

interface MenuStore {
  menus: MenuItem[];
  selectedMenuId: string | null;
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMenus: () => Promise<void>;
  selectMenu: (id: string | null) => void;
  selectCategory: (category: string) => void;
  createMenu: (input: CreateMenuInput) => Promise<void>;
  updateMenu: (id: string, input: UpdateMenuInput) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
  moveMenu: (id: string, parentId: string | null) => Promise<void>;
  reorderMenu: (id: string, order: number) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  menus: [],
  selectedMenuId: null,
  selectedCategory: "menus",
  isLoading: false,
  error: null,

  fetchMenus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/menus");
      if (!response.ok) throw new Error("Failed to fetch menus");
      const data = await response.json();
      set({ menus: data.data, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      set({ error: message, isLoading: false });
    }
  },

  selectMenu: (id) => {
    set({ selectedMenuId: id });
  },

  selectCategory: (category) => {
    set({ selectedCategory: category, selectedMenuId: null });
  },

  createMenu: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create menu");
      }

      await get().fetchMenus();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      set({ error: message, isLoading: false });
    }
  },

  updateMenu: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update menu");
      }

      await get().fetchMenus();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      set({ error: message, isLoading: false });
    }
  },

  deleteMenu: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete menu");
      }

      await get().fetchMenus();
      set({ selectedMenuId: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      set({ error: message, isLoading: false });
    }
  },

  moveMenu: async (id, parentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/menus/${id}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to move menu");
      }

      await get().fetchMenus();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      set({ error: message, isLoading: false });
    }
  },

  reorderMenu: async (id, order) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/menus/${id}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reorder menu");
      }

      await get().fetchMenus();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      set({ error: message, isLoading: false });
    }
  },

  setError: (error) => {
    set({ error });
  },
}));
