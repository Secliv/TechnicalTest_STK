import { RequestHandler } from "express";
import { z } from "zod";
import { MenuService } from "../services/menu.service";
import { CreateMenuInput, UpdateMenuInput, MoveMenuInput, ReorderMenuInput, MenuItem } from "@shared/api";

// Validation schemas
const createMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  parentId: z.string().optional().nullable(),
});

const updateMenuSchema = z.object({
  name: z.string().min(1).optional(),
  label: z.string().min(1).optional(),
  parentId: z.string().optional().nullable(),
});

const moveMenuSchema = z.object({
  parentId: z.string().optional().nullable(),
});

const reorderMenuSchema = z.object({
  order: z.number().min(0),
});

// Get all menus in tree structure
export const getMenus: RequestHandler = (_req, res) => {
  try {
    const menus = MenuService.getAllMenus();
    res.json({ data: menus });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch menus",
    });
  }
};

// Get single menu by ID
export const getMenuById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const menu = MenuService.getMenuWithChildren(id);

    if (!menu) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Menu not found",
      });
    }

    res.json({ data: menu });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch menu",
    });
  }
};

// Create new menu
export const createMenu: RequestHandler = (req, res) => {
  try {
    const validationResult = createMenuSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: validationResult.error.errors[0].message,
      });
    }

    const input = validationResult.data as CreateMenuInput;

    // Validate parent exists if provided
    if (input.parentId) {
      const parent = MenuService.getMenuById(input.parentId);
      if (!parent) {
        return res.status(404).json({
          error: "PARENT_NOT_FOUND",
          message: "Parent menu not found",
        });
      }
    }

    const newMenu = MenuService.createMenu(input);
    res.status(201).json({ data: newMenu });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to create menu",
    });
  }
};

// Update menu
export const updateMenu: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const validationResult = updateMenuSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: validationResult.error.errors[0].message,
      });
    }

    const input: UpdateMenuInput = validationResult.data;

    // Check if menu exists
    const menu = MenuService.getMenuById(id);
    if (!menu) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Menu not found",
      });
    }

    // Validate new parent exists if provided
    if (input.parentId && input.parentId !== menu.parentId) {
      const parent = MenuService.getMenuById(input.parentId);
      if (!parent) {
        return res.status(404).json({
          error: "PARENT_NOT_FOUND",
          message: "Parent menu not found",
        });
      }

      // Prevent moving to self or descendants
      const isDescendant = (menuId: string, targetId: string): boolean => {
        const allMenus = Array.from((MenuService as any).menus?.values?.() || []);
        const target = allMenus.find((m: any) => m.id === targetId) as MenuItem;
        if (!target) return false;
        if (target.parentId === menuId) return true;
        return isDescendant(menuId, target.parentId || "");
      };

      if (input.parentId === id || isDescendant(id, input.parentId)) {
        return res.status(400).json({
          error: "INVALID_OPERATION",
          message: "Cannot move menu to its own descendant",
        });
      }
    }

    const updated = MenuService.updateMenu(id, input);
    if (!updated) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Menu not found",
      });
    }

    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to update menu",
    });
  }
};

// Delete menu
export const deleteMenu: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    // Check if menu exists
    const menu = MenuService.getMenuById(id);
    if (!menu) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Menu not found",
      });
    }

    MenuService.deleteMenu(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete menu",
    });
  }
};

// Move menu to different parent
export const moveMenu: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const validationResult = moveMenuSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: validationResult.error.errors[0].message,
      });
    }

    const input: MoveMenuInput = validationResult.data;

    // Check if menu exists
    const menu = MenuService.getMenuById(id);
    if (!menu) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Menu not found",
      });
    }

    // Validate new parent exists if provided
    if (input.parentId) {
      const parent = MenuService.getMenuById(input.parentId);
      if (!parent) {
        return res.status(404).json({
          error: "PARENT_NOT_FOUND",
          message: "Parent menu not found",
        });
      }
    }

    const moved = MenuService.moveMenu(id, input.parentId || null);
    res.json({ data: moved });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to move menu",
    });
  }
};

// Reorder menu within same level
export const reorderMenu: RequestHandler = (req, res) => {
  try {
    const validationResult = reorderMenuSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: validationResult.error.errors[0].message,
      });
    }

    const input = validationResult.data as ReorderMenuInput;

    // Check if menu exists
    const menu = MenuService.getMenuById(req.params.id);
    if (!menu) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Menu not found",
      });
    }

    const reordered = MenuService.reorderMenu(req.params.id, input.order);
    res.json({ data: reordered });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to reorder menu",
    });
  }
};
