import { useMenuStore } from "@/store/menu.store";
import { useEffect, useState } from "react";

export default function MenuForm() {
  const { selectedMenuId, menus } = useMenuStore();
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  // Find selected menu recursively
  useEffect(() => {
    const findMenu = (items: any[], id: string | null): any => {
      if (!id) return null;
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findMenu(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    if (selectedMenuId) {
      setSelectedMenu(findMenu(menus, selectedMenuId));
    } else {
      setSelectedMenu(null);
    }
  }, [selectedMenuId, menus]);

  if (!selectedMenu) {
    return (
      <div className="w-full max-w-[532px] flex items-center justify-center h-full">
        <p className="text-gray-500">Select a menu item to view details</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[532px] flex flex-col gap-8 md:gap-[91px]">
      {/* Menu ID Field */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-600">
          Menu ID
        </label>
        <div className="flex min-h-[52px] px-4 py-3.5 items-center gap-4 rounded-2xl bg-gray-50">
          <span className="flex-1 text-base font-normal leading-4 tracking-[-0.32px] text-gray-500 truncate">
            {selectedMenu.id}
          </span>
        </div>
      </div>

      {/* Depth Field */}
      <div className="flex flex-col gap-2 w-full md:w-[262px]">
        <label className="text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-600">
          Depth
        </label>
        <div className="flex min-h-[52px] px-4 py-3.5 items-center gap-4 rounded-2xl bg-gray-200">
          <span className="flex-1 text-base font-normal leading-4 tracking-[-0.32px] text-gray-600">
            {selectedMenu.depth}
          </span>
        </div>
      </div>

      {/* Parent Data Field */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-600">
          Parent Data
        </label>
        <div className="flex min-h-[52px] px-4 py-3.5 items-center gap-4 rounded-2xl bg-gray-50">
          <span className="flex-1 h-4 text-base font-normal leading-4 tracking-[-0.32px] text-gray-900">
            {selectedMenu.parentId ? selectedMenu.parentId : "Root"}
          </span>
          <div className="w-6 h-6" />
        </div>
      </div>

      {/* Name Field */}
      <div className="flex flex-col gap-2 w-full md:w-[262px]">
        <label className="text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-600">
          Name
        </label>
        <div className="flex min-h-[52px] px-4 py-3.5 items-center gap-4 rounded-2xl bg-gray-50">
          <span className="flex-1 h-4 text-base font-normal leading-4 tracking-[-0.32px] text-gray-900">
            {selectedMenu.name}
          </span>
          <div className="w-6 h-6" />
        </div>
      </div>

      {/* Label Field */}
      <div className="flex flex-col gap-2 w-full md:w-[262px]">
        <label className="text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-600">
          Label
        </label>
        <div className="flex min-h-[52px] px-4 py-3.5 items-center gap-4 rounded-2xl bg-gray-50">
          <span className="flex-1 h-4 text-base font-normal leading-4 tracking-[-0.32px] text-gray-900">
            {selectedMenu.label}
          </span>
          <div className="w-6 h-6" />
        </div>
      </div>

      {/* Created At Field */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-600">
          Created At
        </label>
        <div className="flex min-h-[52px] px-4 py-3.5 items-center gap-4 rounded-2xl bg-gray-50">
          <span className="flex-1 text-base font-normal leading-4 tracking-[-0.32px] text-gray-500">
            {new Date(selectedMenu.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Updated At Field */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-600">
          Updated At
        </label>
        <div className="flex min-h-[52px] px-4 py-3.5 items-center gap-4 rounded-2xl bg-gray-50">
          <span className="flex-1 text-base font-normal leading-4 tracking-[-0.32px] text-gray-500">
            {new Date(selectedMenu.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
