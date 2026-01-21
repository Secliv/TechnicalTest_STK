import { Folder, ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useMenuStore } from "@/store/menu.store";
import Sidebar from "@/components/Sidebar";
import MenuTree, { MenuTreeHandle } from "@/components/MenuTree";
import MenuForm from "@/components/MenuForm";

const SubMenuIconLarge = () => (
  <div className="w-6 h-6 relative flex-shrink-0">
    <div className="w-[7px] h-[7px] rounded-[1px] bg-white absolute left-1 top-1" />
    <div className="w-[7px] h-[7px] rounded-[1px] bg-white absolute left-1 bottom-1" />
    <div className="w-[7px] h-[7px] rounded-[1px] bg-white absolute right-1 bottom-1" />
    <div className="w-[7px] h-[7px] rounded-full bg-white absolute right-1 top-1" />
  </div>
);

export default function Index() {
  const menuTreeRef = useRef<MenuTreeHandle>(null);
  const { selectedCategory } = useMenuStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleExpandAll = () => {
    menuTreeRef.current?.expandAll();
  };

  const handleCollapseAll = () => {
    menuTreeRef.current?.collapseAll();
  };

  // Get the title and breadcrumb based on selected category
  const getCategoryInfo = () => {
    const categoryMap: Record<string, { title: string; breadcrumb: string }> = {
      "menus": { title: "Menus", breadcrumb: "Menus" },
      "system-code": { title: "System Code", breadcrumb: "System Code" },
      "properties": { title: "Properties", breadcrumb: "Properties" },
      "api-list": { title: "API List", breadcrumb: "API List" },
      "users-group": { title: "Users & Group", breadcrumb: "Users & Group" },
      "competition": { title: "Competition", breadcrumb: "Competition" },
    };
    return categoryMap[selectedCategory] || categoryMap["menus"];
  };

  const categoryInfo = getCategoryInfo();
  const showMenuTree = selectedCategory === "menus";
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar - Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full z-50 lg:hidden transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onMenuClick={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Breadcrumb */}
        <div className="flex items-center justify-between px-6 md:px-12 py-4 h-[84px] mt-6">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <MenuIcon className="w-6 h-6 text-gray-900" />
              )}
            </button>
            
            <Folder className="w-6 h-6 text-gray-300 fill-gray-300" />
            <span className="text-sm font-normal leading-5 text-gray-300">/</span>
            <span className="text-sm font-medium leading-[14px] tracking-[-0.28px] text-gray-900">
              {categoryInfo.breadcrumb}
            </span>
          </div>
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between px-6 md:px-12 py-4 h-[84px] bg-white">
          <div className="flex items-center gap-4 flex-1">
            {/* Icon Title */}
            <div className="w-[52px] h-[52px] rounded-full bg-blue-primary flex items-center justify-center relative flex-shrink-0">
              <SubMenuIconLarge />
            </div>
            <h1 className="text-2xl md:text-[32px] font-extrabold leading-[125%] tracking-[-1.28px] text-gray-900">
              {categoryInfo.title}
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 md:px-12 flex flex-col xl:flex-row gap-8 pb-8">
          {/* Left Column - Menu Selection and Tree */}
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            {/* Menu Dropdown */}
            {showMenuTree && (
              <div className="flex flex-col gap-2 max-w-[349px] w-full">
                <label className="text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-600">
                  Menu
                </label>
                <div className="flex min-h-[52px] px-4 py-3.5 items-center gap-4 rounded-2xl bg-gray-50">
                  <span className="flex-1 h-4 text-base font-normal leading-4 tracking-[-0.32px] text-gray-900 truncate">
                    system management
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Buttons - Only show for Menus */}
            {showMenuTree && (
              <div className="flex items-start gap-2 flex-wrap">
                <button 
                  onClick={handleExpandAll}
                  className="flex px-8 py-3 justify-center items-center gap-2.5 rounded-[48px] bg-gray-800 hover:bg-gray-900 transition-colors"
                >
                  <span className="text-sm font-bold leading-[14px] tracking-[-0.28px] text-white">
                    Expand All
                  </span>
                </button>
                <button 
                  onClick={handleCollapseAll}
                  className="flex px-8 py-3 justify-center items-center gap-2.5 rounded-[48px] border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-bold leading-[14px] tracking-[-0.28px] text-gray-600">
                    Collapse All
                  </span>
                </button>
              </div>
            )}

            {/* Menu Tree - Only show for Menus */}
            {showMenuTree ? (
              <div className="flex-1 overflow-x-auto">
                <MenuTree ref={menuTreeRef} />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-2xl">
                <p className="text-gray-500 text-lg">
                  {categoryInfo.title} section coming soon...
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          {showMenuTree && (
            <div className="xl:pt-[96px] w-full xl:w-auto flex-shrink-0">
              <div className="max-w-[532px] w-full mx-auto xl:mx-0">
                <MenuForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
