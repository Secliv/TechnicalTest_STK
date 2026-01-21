import { ChevronDown, Plus, Trash2, Edit2 } from "lucide-react";
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useMenuStore } from "@/store/menu.store";
import { MenuItem } from "@shared/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ExpandedState {
  [key: string]: boolean;
}

// Calculate padding based on depth (in pixels)
const getPaddingLeft = (depth: number): number => {
  return (depth - 1) * 26 + 13;
};

interface MenuTreeItemProps {
  node: MenuItem;
  expanded: ExpandedState;
  onToggle: (id: string) => void;
  onSelectMenu: (menu: MenuItem) => void;
  onDelete: (id: string) => void;
  onEdit: (menu: MenuItem) => void;
  onAdd: (parentId: string) => void;
}

function MenuTreeItem({
  node,
  expanded,
  onToggle,
  onSelectMenu,
  onDelete,
  onEdit,
  onAdd,
}: MenuTreeItemProps) {
  const paddingLeft = getPaddingLeft(node.depth);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div
      className="flex items-center gap-3 h-[26px] relative mb-3 group"
      style={{ paddingLeft: `${paddingLeft}px` }}
      data-node-id={node.id}
      data-depth={node.depth}
    >
      {/* Toggle button */}
      {hasChildren && (
        <button
          onClick={() => onToggle(node.id)}
          className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-900 transition-transform ${
              expanded[node.id] ? "" : "-rotate-90"
            }`}
          />
        </button>
      )}

      {!hasChildren && <div className="w-[26px] h-[26px] flex-shrink-0" />}

      {/* Label - clickable */}
      <button
        onClick={() => onSelectMenu(node)}
        className="flex-1 text-left text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-900 hover:text-blue-primary transition-colors"
      >
        {node.label}
      </button>

      {/* Action buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onAdd(node.id)}
          title="Add child menu"
          className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-blue-primary hover:bg-blue-secondary transition-colors flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2} />
        </button>
        <button
          onClick={() => onEdit(node)}
          title="Edit menu"
          className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0"
        >
          <Edit2 className="w-3.5 h-3.5 text-gray-900" />
        </button>
        <button
          onClick={() => onDelete(node.id)}
          title="Delete menu"
          className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-red-100 hover:bg-red-200 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
        </button>
      </div>
    </div>
  );
}

interface RenderTreeProps {
  nodes: MenuItem[];
  expanded: ExpandedState;
  onToggle: (id: string) => void;
  onSelectMenu: (menu: MenuItem) => void;
  onDelete: (id: string) => void;
  onEdit: (menu: MenuItem) => void;
  onAdd: (parentId: string) => void;
}

function RenderTree({
  nodes,
  expanded,
  onToggle,
  onSelectMenu,
  onDelete,
  onEdit,
  onAdd,
}: RenderTreeProps) {
  return (
    <>
      {nodes.map((node) => (
        <div key={node.id}>
          <MenuTreeItem
            node={node}
            expanded={expanded}
            onToggle={onToggle}
            onSelectMenu={onSelectMenu}
            onDelete={onDelete}
            onEdit={onEdit}
            onAdd={onAdd}
          />
          {expanded[node.id] && node.children && node.children.length > 0 && (
            <RenderTree
              nodes={node.children}
              expanded={expanded}
              onToggle={onToggle}
              onSelectMenu={onSelectMenu}
              onDelete={onDelete}
              onEdit={onEdit}
              onAdd={onAdd}
            />
          )}
        </div>
      ))}
    </>
  );
}

interface MenuTreeProps {
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  expandedState?: ExpandedState;
  setExpandedState?: (state: ExpandedState) => void;
}

export interface MenuTreeHandle {
  expandAll: () => void;
  collapseAll: () => void;
}

const MenuTree = forwardRef<MenuTreeHandle, MenuTreeProps>(
  function MenuTree(
    {
      onExpandAll,
      onCollapseAll,
      expandedState,
      setExpandedState,
    }: MenuTreeProps,
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
    const [editName, setEditName] = useState("");
    const [editLabel, setEditLabel] = useState("");
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [addParentId, setAddParentId] = useState<string | null>(null);
    const [addName, setAddName] = useState("");
    const [addLabel, setAddLabel] = useState("");

  const {
    menus,
    fetchMenus,
    selectMenu,
    deleteMenu: deleteMenuAction,
    updateMenu: updateMenuAction,
    createMenu: createMenuAction,
  } = useMenuStore();

  // Expose expand/collapse methods to parent
  useImperativeHandle(ref, () => ({
    expandAll: handleExpandAll,
    collapseAll: handleCollapseAll,
  }));

  // Fetch menus on mount
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Expand all by default
  useEffect(() => {
    const expandAll = (nodes: MenuItem[]) => {
      const newExpanded: ExpandedState = {};
      const traverse = (items: MenuItem[]) => {
        items.forEach((item) => {
          newExpanded[item.id] = true;
          if (item.children && item.children.length > 0) {
            traverse(item.children);
          }
        });
      };
      traverse(nodes);
      return newExpanded;
    };

    if (menus.length > 0) {
      setExpanded(expandAll(menus));
    }
  }, [menus]);

  const handleToggle = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const expandAll = (nodes: MenuItem[]) => {
      const newExpanded: ExpandedState = {};
      const traverse = (items: MenuItem[]) => {
        items.forEach((item) => {
          newExpanded[item.id] = true;
          if (item.children && item.children.length > 0) {
            traverse(item.children);
          }
        });
      };
      traverse(nodes);
      return newExpanded;
    };

    const newExpandedState = expandAll(menus);
    setExpanded(newExpandedState);
    if (setExpandedState) {
      setExpandedState(newExpandedState);
    }
    if (onExpandAll) {
      onExpandAll();
    }
  };

  const handleCollapseAll = () => {
    const newExpandedState: ExpandedState = {};
    setExpanded(newExpandedState);
    if (setExpandedState) {
      setExpandedState(newExpandedState);
    }
    if (onCollapseAll) {
      onCollapseAll();
    }
  };

  const handleDelete = (id: string) => {
    setDeleteMenuId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteMenuId) {
      await deleteMenuAction(deleteMenuId);
      setDeleteDialogOpen(false);
      setDeleteMenuId(null);
    }
  };

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setEditName(menu.name);
    setEditLabel(menu.label);
    setEditDialogOpen(true);
  };

  const confirmEdit = async () => {
    if (editingMenu) {
      await updateMenuAction(editingMenu.id, {
        name: editName,
        label: editLabel,
      });
      setEditDialogOpen(false);
      setEditingMenu(null);
    }
  };

  const handleAdd = (parentId: string) => {
    setAddParentId(parentId);
    setAddName("");
    setAddLabel("");
    setAddDialogOpen(true);
  };

  const confirmAdd = async () => {
    if (addName && addLabel) {
      await createMenuAction({
        name: addName,
        label: addLabel,
        parentId: addParentId,
      });
      setAddDialogOpen(false);
      setAddParentId(null);
    }
  };

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        <RenderTree
          nodes={menus}
          expanded={expanded}
          onToggle={handleToggle}
          onSelectMenu={(menu: MenuItem) => selectMenu(menu.id)}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onAdd={handleAdd}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this menu and all its children?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
            <DialogDescription>Update menu details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Menu name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label</Label>
              <Input
                id="edit-label"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="Menu label"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu</DialogTitle>
            <DialogDescription>Create a new menu item</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Menu name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-label">Label</Label>
              <Input
                id="add-label"
                value={addLabel}
                onChange={(e) => setAddLabel(e.target.value)}
                placeholder="Menu label"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAdd} disabled={!addName || !addLabel}>
              Create Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
);

export default MenuTree;
