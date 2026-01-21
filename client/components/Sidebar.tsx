import { Menu, Folder, Grid2X2 } from "lucide-react";
import { useState } from "react";
import { useMenuStore } from "@/store/menu.store";

interface MenuItem {
  id: string;
  label: string;
  icon?: "folder" | "folder-open" | "grid" | "submenu";
  active?: boolean;
  isExpanded?: boolean;
}

interface SidebarProps {
  onMenuClick?: () => void;
}

const systemSubMenuItems: MenuItem[] = [
  {
    id: "system-code",
    label: "System Code",
    icon: "submenu",
  },
  {
    id: "properties",
    label: "Properties",
    icon: "submenu",
  },
  {
    id: "menus",
    label: "Menus",
    icon: "submenu",
    active: true,
  },
  {
    id: "api-list",
    label: "API List",
    icon: "submenu",
  },
];

const SubMenuIcon = ({ active = false }: { active?: boolean }) => (
  <div className="w-6 h-6 flex items-center justify-center relative flex-shrink-0">
    <div
      className={`w-[7px] h-[7px] rounded-[1px] absolute left-1 top-1 ${
        active ? "bg-blue-primary" : "border border-white"
      }`}
    />
    <div
      className={`w-[7px] h-[7px] rounded-[1px] absolute left-1 bottom-1 ${
        active ? "bg-blue-primary" : "border border-white"
      }`}
    />
    <div
      className={`w-[7px] h-[7px] rounded-[1px] absolute right-1 bottom-1 ${
        active ? "bg-blue-primary" : "border border-white"
      }`}
    />
    <div
      className={`w-[7px] h-[7px] rounded-full absolute right-1 top-1 ${
        active ? "bg-blue-primary" : "border border-white"
      }`}
    />
  </div>
);

export default function Sidebar({ onMenuClick }: SidebarProps) {
  const { selectedCategory, selectCategory } = useMenuStore();
  const [isSystemExpanded, setIsSystemExpanded] = useState(true);

  const handleCategoryClick = (categoryId: string) => {
    selectCategory(categoryId);
  };

  return (
    <div className="w-60 h-[calc(100vh-48px)] rounded-3xl bg-blue-primary overflow-hidden m-6">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-[30px] h-[90px]">
        <img
          src="/logo sementara 4.png"
          alt="Logo"
          className="w-[70px] h-auto object-contain"
        />
        <img
          src="/menu.png"
          alt="Menu"
          className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onMenuClick}
        />
      </div>

      {/* Content */}
      <div className="px-4 py-2.5 flex flex-col gap-6">
        {/* Menu Section */}
        <div className="flex flex-col gap-3">
          {/* Systems Section - Main Menu with Submenu expand/collapse */}
          <div className="w-52">
            {/* Consistent container structure */}
            <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
              isSystemExpanded 
                ? "bg-blue-secondary p-2" 
                : ""
            }`}>
              {/* System Main Item - Always visible and consistent */}
              <div 
                onClick={() => setIsSystemExpanded(!isSystemExpanded)}
                className="flex items-center gap-4 px-3 py-3 h-12 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
              >
                <Folder className="w-6 h-6 text-white fill-white" />
                <span className="text-sm font-bold leading-[14px] tracking-[-0.28px] text-white">
                  System
                </span>
              </div>

              {/* System Submenu Items - Smooth height transition */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSystemExpanded ? "max-h-96" : "max-h-0"
              }`}>
                {systemSubMenuItems.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleCategoryClick(item.id)}
                    className={`flex items-center gap-4 px-3 py-3 h-12 rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === item.id
                        ? "bg-white"
                        : "hover:bg-white/10"
                    }`}
                    style={{
                      animation: isSystemExpanded 
                        ? `fadeIn 0.3s ease-out ${index * 50}ms forwards`
                        : "none",
                      opacity: isSystemExpanded ? 1 : 0,
                    }}
                  >
                    {item.icon === "folder-open" && (
                      <Folder className="w-6 h-6 text-white fill-white" />
                    )}
                    {item.icon === "submenu" && (
                      <SubMenuIcon active={selectedCategory === item.id} />
                    )}
                    {item.icon === "grid" && (
                      <Grid2X2
                        className={`w-6 h-6 ${
                          selectedCategory === item.id ? "text-blue-primary" : "text-white"
                        }`}
                      />
                    )}
                    <span
                      className={`text-sm font-bold leading-[14px] tracking-[-0.28px] ${
                        selectedCategory === item.id ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Users & Group */}
          <div 
            onClick={() => handleCategoryClick("users-group")}
            className={`flex items-center gap-4 px-3 py-3 h-12 rounded-2xl transition-colors cursor-pointer ${
              selectedCategory === "users-group"
                ? "bg-white"
                : "hover:bg-white/10"
            }`}
          >
            <Folder
              className={`w-6 h-6 ${
                selectedCategory === "users-group" ? "text-blue-primary fill-blue-primary" : "text-white fill-white"
              }`}
              strokeWidth={1.5}
            />
            <span className={`text-sm font-bold leading-[14px] tracking-[-0.28px] ${
              selectedCategory === "users-group" ? "text-gray-900" : "text-white"
            }`}>
              Users & Group
            </span>
          </div>

          {/* Competition */}
          <div 
            onClick={() => handleCategoryClick("competition")}
            className={`flex items-center gap-4 px-3 py-3 h-12 rounded-2xl transition-colors cursor-pointer ${
              selectedCategory === "competition"
                ? "bg-white"
                : "hover:bg-white/10"
            }`}
          >
            <Folder
              className={`w-6 h-6 ${
                selectedCategory === "competition" ? "text-blue-primary fill-blue-primary" : "text-white fill-white"
              }`}
              strokeWidth={1.5}
            />
            <span className={`text-sm font-bold leading-[14px] tracking-[-0.28px] ${
              selectedCategory === "competition" ? "text-gray-900" : "text-white"
            }`}>
              Competition
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
