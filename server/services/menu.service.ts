import { MenuItem, CreateMenuInput, UpdateMenuInput } from "@shared/api";
import { v4 as uuidv4 } from "uuid";

export let menus: Map<string, MenuItem> = new Map();
let nextDepth: Map<string, number> = new Map();

// Initialize with sample data
function initializeSampleData() {
  const systemManagement: MenuItem = {
    id: "1",
    name: "system_management",
    label: "System Management",
    depth: 1,
    order: 0,
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
  };

  const systemMgmt: MenuItem = {
    id: "1-1",
    name: "system_mgmt",
    label: "System Management",
    depth: 2,
    order: 0,
    parentId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
  };

  const systems: MenuItem = {
    id: "1-1-1",
    name: "systems",
    label: "Systems",
    depth: 3,
    order: 0,
    parentId: "1-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
  };

  const systemCode: MenuItem = {
    id: "1-1-1-1",
    name: "system_code",
    label: "System Code",
    depth: 4,
    order: 0,
    parentId: "1-1-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
  };

  const codeRegistration: MenuItem = {
    id: "1-1-1-1-1",
    name: "code_registration",
    label: "Code Registration",
    depth: 5,
    order: 0,
    parentId: "1-1-1-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
  };

  [systemManagement, systemMgmt, systems, systemCode, codeRegistration].forEach((menu) => {
    menus.set(menu.id, menu);
  });
}

initializeSampleData();

function buildTree(items: MenuItem[], parentId: string | null = null): MenuItem[] {
  return items
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      children: buildTree(items, item.id),
    }));
}

export const MenuService = {
  getAllMenus(): MenuItem[] {
    const allMenus = Array.from(menus.values());
    return buildTree(allMenus);
  },

  getMenuById(id: string): MenuItem | null {
    return menus.get(id) || null;
  },

  getMenuWithChildren(id: string): MenuItem | null {
    const menu = menus.get(id);
    if (!menu) return null;

    const allMenus = Array.from(menus.values());
    const children = buildTree(allMenus, menu.id);

    return {
      ...menu,
      children,
    };
  },

  createMenu(input: CreateMenuInput): MenuItem {
    const parent = input.parentId ? menus.get(input.parentId) : null;
    const depth = parent ? parent.depth + 1 : 1;

    // Get siblings to determine order
    const allMenus = Array.from(menus.values());
    const siblings = allMenus.filter((m) => m.parentId === (input.parentId || null));
    const order = siblings.length;

    const newMenu: MenuItem = {
      id: uuidv4(),
      name: input.name,
      label: input.label,
      depth,
      order,
      parentId: input.parentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      children: [],
    };

    menus.set(newMenu.id, newMenu);
    return newMenu;
  },

  updateMenu(id: string, input: UpdateMenuInput): MenuItem | null {
    const menu = menus.get(id);
    if (!menu) return null;

    const updated: MenuItem = {
      ...menu,
      ...(input.name && { name: input.name }),
      ...(input.label && { label: input.label }),
      ...(input.parentId !== undefined && { parentId: input.parentId }),
      updatedAt: new Date().toISOString(),
    };

    if (input.parentId !== undefined && input.parentId !== menu.parentId) {
      // Recalculate depth if parent changed
      if (input.parentId) {
        const newParent = menus.get(input.parentId);
        if (newParent) {
          updated.depth = newParent.depth + 1;
          // Update all descendants' depth
          const updateDescendantsDepth = (menuId: string, depthDiff: number) => {
            const allMenus = Array.from(menus.values());
            allMenus.forEach((m) => {
              if (m.parentId === menuId) {
                m.depth += depthDiff;
                updateDescendantsDepth(m.id, depthDiff);
              }
            });
          };

          const depthDiff = updated.depth - menu.depth;
          if (depthDiff !== 0) {
            updateDescendantsDepth(id, depthDiff);
          }
        }
      } else {
        updated.depth = 1;
        const depthDiff = 1 - menu.depth;
        const updateDescendantsDepth = (menuId: string, diff: number) => {
          const allMenus = Array.from(menus.values());
          allMenus.forEach((m) => {
            if (m.parentId === menuId) {
              m.depth += diff;
              updateDescendantsDepth(m.id, diff);
            }
          });
        };
        if (depthDiff !== 0) {
          updateDescendantsDepth(id, depthDiff);
        }
      }
    }

    menus.set(id, updated);
    return updated;
  },

  deleteMenu(id: string): boolean {
    const menu = menus.get(id);
    if (!menu) return false;

    // Delete all descendants
    const deleteDescendants = (menuId: string) => {
      const allMenus = Array.from(menus.values());
      allMenus.forEach((m) => {
        if (m.parentId === menuId) {
          deleteDescendants(m.id);
          menus.delete(m.id);
        }
      });
    };

    deleteDescendants(id);
    menus.delete(id);
    return true;
  },

  moveMenu(id: string, parentId: string | null): MenuItem | null {
    return this.updateMenu(id, { parentId });
  },

  reorderMenu(id: string, newOrder: number): MenuItem | null {
    const menu = menus.get(id);
    if (!menu) return null;

    // Get all siblings
    const allMenus = Array.from(menus.values());
    const siblings = allMenus
      .filter((m) => m.parentId === menu.parentId)
      .sort((a, b) => a.order - b.order);

    // Remove current item from siblings
    const otherSiblings = siblings.filter((s) => s.id !== id);

    // Insert at new position
    if (newOrder < 0) newOrder = 0;
    if (newOrder > otherSiblings.length) newOrder = otherSiblings.length;

    // Update orders
    let orderCounter = 0;
    otherSiblings.forEach((sibling, index) => {
      if (index === newOrder) {
        menu.order = orderCounter;
        orderCounter++;
      }
      sibling.order = orderCounter;
      orderCounter++;
    });

    if (newOrder >= otherSiblings.length) {
      menu.order = orderCounter;
    }

    menu.updatedAt = new Date().toISOString();
    menus.set(id, menu);
    return menu;
  },
};
