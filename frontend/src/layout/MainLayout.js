import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-gray-800 p-6 flex flex-col">

        <h1 className="text-2xl font-semibold text-white mb-10 tracking-wide">
          SmartVyapaar
        </h1>

        <nav className="space-y-3 flex-1">
          <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarLink to="/inventory" icon={<Package size={18} />} label="Inventory" />
          <SidebarLink to="/sales" icon={<ShoppingCart size={18} />} label="Sales" />
        </nav>

        <div className="text-xs text-gray-500 mt-10">
          © 2026 SmartVyapaar
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "text-black-400 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

export default MainLayout;