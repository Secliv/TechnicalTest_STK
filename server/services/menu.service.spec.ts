import { describe, it, expect, beforeEach } from "vitest";
import { MenuService, menus } from "../services/menu.service";

describe("MenuService", () => {
  beforeEach(() => {
    // Clear menus before each test
    menus.clear();
  });

  describe("createMenu", () => {
    it("should create a root menu", () => {
      const newMenu = MenuService.createMenu({
        name: "test_menu",
        label: "Test Menu",
      });

      expect(newMenu).toBeDefined();
      expect(newMenu.name).toBe("test_menu");
      expect(newMenu.label).toBe("Test Menu");
      expect(newMenu.depth).toBe(1);
      expect(newMenu.parentId).toBeNull();
    });

    it("should create a child menu with correct depth", () => {
      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent Menu",
      });

      const child = MenuService.createMenu({
        name: "child",
        label: "Child Menu",
        parentId: parent.id,
      });

      expect(child.depth).toBe(2);
      expect(child.parentId).toBe(parent.id);
    });

    it("should handle multiple children", () => {
      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent Menu",
      });

      const child1 = MenuService.createMenu({
        name: "child1",
        label: "Child 1",
        parentId: parent.id,
      });

      const child2 = MenuService.createMenu({
        name: "child2",
        label: "Child 2",
        parentId: parent.id,
      });

      expect(child1.order).toBe(0);
      expect(child2.order).toBe(1);
    });
  });

  describe("getMenuById", () => {
    it("should return menu by id", () => {
      const created = MenuService.createMenu({
        name: "test",
        label: "Test",
      });

      const found = MenuService.getMenuById(created.id);
      expect(found).toEqual(created);
    });

    it("should return null for non-existent menu", () => {
      const found = MenuService.getMenuById("non-existent");
      expect(found).toBeNull();
    });
  });

  describe("updateMenu", () => {
    it("should update menu name and label", () => {
      const menu = MenuService.createMenu({
        name: "original",
        label: "Original",
      });

      const updated = MenuService.updateMenu(menu.id, {
        name: "updated",
        label: "Updated",
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe("updated");
      expect(updated?.label).toBe("Updated");
    });

    it("should update parentId", () => {
      const parent1 = MenuService.createMenu({
        name: "parent1",
        label: "Parent 1",
      });

      const parent2 = MenuService.createMenu({
        name: "parent2",
        label: "Parent 2",
      });

      const child = MenuService.createMenu({
        name: "child",
        label: "Child",
        parentId: parent1.id,
      });

      const updated = MenuService.updateMenu(child.id, {
        parentId: parent2.id,
      });

      expect(updated?.parentId).toBe(parent2.id);
    });

    it("should update depth when parent changes", () => {
      const grandparent = MenuService.createMenu({
        name: "grandparent",
        label: "Grandparent",
      });

      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent",
        parentId: grandparent.id,
      });

      const child = MenuService.createMenu({
        name: "child",
        label: "Child",
        parentId: parent.id,
      });

      expect(child.depth).toBe(3);

      // Move child directly under grandparent
      const updated = MenuService.updateMenu(child.id, {
        parentId: grandparent.id,
      });

      expect(updated?.depth).toBe(2);
    });

    it("should return null for non-existent menu", () => {
      const updated = MenuService.updateMenu("non-existent", {
        name: "updated",
      });

      expect(updated).toBeNull();
    });
  });

  describe("deleteMenu", () => {
    it("should delete a menu", () => {
      const menu = MenuService.createMenu({
        name: "to_delete",
        label: "To Delete",
      });

      const deleted = MenuService.deleteMenu(menu.id);
      expect(deleted).toBe(true);

      const found = MenuService.getMenuById(menu.id);
      expect(found).toBeNull();
    });

    it("should delete menu and all children", () => {
      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent",
      });

      const child1 = MenuService.createMenu({
        name: "child1",
        label: "Child 1",
        parentId: parent.id,
      });

      const child2 = MenuService.createMenu({
        name: "child2",
        label: "Child 2",
        parentId: parent.id,
      });

      MenuService.deleteMenu(parent.id);

      expect(MenuService.getMenuById(parent.id)).toBeNull();
      expect(MenuService.getMenuById(child1.id)).toBeNull();
      expect(MenuService.getMenuById(child2.id)).toBeNull();
    });

    it("should return false for non-existent menu", () => {
      const deleted = MenuService.deleteMenu("non-existent");
      expect(deleted).toBe(false);
    });
  });

  describe("getAllMenus", () => {
    it("should return empty array initially", () => {
      const allMenus = MenuService.getAllMenus();
      expect(allMenus).toEqual([]);
    });

    it("should return menus in tree structure", () => {
      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent",
      });

      const child = MenuService.createMenu({
        name: "child",
        label: "Child",
        parentId: parent.id,
      });

      const allMenus = MenuService.getAllMenus();
      expect(allMenus).toHaveLength(1);
      expect(allMenus[0].id).toBe(parent.id);
      expect(allMenus[0].children).toHaveLength(1);
      expect(allMenus[0].children?.[0].id).toBe(child.id);
    });

    it("should sort children by order", () => {
      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent",
      });

      const child1 = MenuService.createMenu({
        name: "child1",
        label: "Child 1",
        parentId: parent.id,
      });

      const child2 = MenuService.createMenu({
        name: "child2",
        label: "Child 2",
        parentId: parent.id,
      });

      const child3 = MenuService.createMenu({
        name: "child3",
        label: "Child 3",
        parentId: parent.id,
      });

      const allMenus = MenuService.getAllMenus();
      const children = allMenus[0].children || [];

      expect(children[0].id).toBe(child1.id);
      expect(children[1].id).toBe(child2.id);
      expect(children[2].id).toBe(child3.id);
    });
  });

  describe("moveMenu", () => {
    it("should move menu to different parent", () => {
      const parent1 = MenuService.createMenu({
        name: "parent1",
        label: "Parent 1",
      });

      const parent2 = MenuService.createMenu({
        name: "parent2",
        label: "Parent 2",
      });

      const child = MenuService.createMenu({
        name: "child",
        label: "Child",
        parentId: parent1.id,
      });

      const moved = MenuService.moveMenu(child.id, parent2.id);
      expect(moved?.parentId).toBe(parent2.id);
    });

    it("should move menu to root", () => {
      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent",
      });

      const child = MenuService.createMenu({
        name: "child",
        label: "Child",
        parentId: parent.id,
      });

      const moved = MenuService.moveMenu(child.id, null);
      expect(moved?.parentId).toBeNull();
      expect(moved?.depth).toBe(1);
    });

    it("should return null for non-existent menu", () => {
      const moved = MenuService.moveMenu("non-existent", null);
      expect(moved).toBeNull();
    });
  });

  describe("reorderMenu", () => {
    it("should change menu order", () => {
      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent",
      });

      const child1 = MenuService.createMenu({
        name: "child1",
        label: "Child 1",
        parentId: parent.id,
      });

      const child2 = MenuService.createMenu({
        name: "child2",
        label: "Child 2",
        parentId: parent.id,
      });

      const child3 = MenuService.createMenu({
        name: "child3",
        label: "Child 3",
        parentId: parent.id,
      });

      // Move child3 to position 0
      MenuService.reorderMenu(child3.id, 0);

      const allMenus = MenuService.getAllMenus();
      const children = allMenus[0].children || [];

      expect(children[0].id).toBe(child3.id);
    });

    it("should handle out of range order", () => {
      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent",
      });

      const child = MenuService.createMenu({
        name: "child",
        label: "Child",
        parentId: parent.id,
      });

      const result = MenuService.reorderMenu(child.id, 999);
      expect(result).toBeDefined();
    });
  });

  describe("getMenuWithChildren", () => {
    it("should return menu with children", () => {
      const parent = MenuService.createMenu({
        name: "parent",
        label: "Parent",
      });

      const child = MenuService.createMenu({
        name: "child",
        label: "Child",
        parentId: parent.id,
      });

      const result = MenuService.getMenuWithChildren(parent.id);
      expect(result?.children).toHaveLength(1);
      expect(result?.children?.[0].id).toBe(child.id);
    });

    it("should return null for non-existent menu", () => {
      const result = MenuService.getMenuWithChildren("non-existent");
      expect(result).toBeNull();
    });
  });
});
