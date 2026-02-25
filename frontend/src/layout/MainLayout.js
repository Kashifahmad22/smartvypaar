import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Building2,
  PlusCircle
} from "lucide-react";

function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-gray-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#111827] border-r border-gray-800 p-6 flex flex-col">

        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            SmartVyapaar
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Retail Intelligence System
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">

          <SidebarLink
            to="/"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />

          <SidebarLink
            to="/inventory"
            icon={<Package size={18} />}
            label="Inventory"
          />

          {/* ADD PRODUCT LINK */}
          <SidebarLink
            to="/add-product"
            icon={<PlusCircle size={18} />}
            label="Add Product"
          />

          <SidebarLink
            to="/sales"
            icon={<ShoppingCart size={18} />}
            label="Sales"
          />

          <SidebarLink
            to="/business"
            icon={<Building2 size={18} />}
            label="Business"
          />

        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all text-white"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-6">
          © 2026 SmartVyapaar
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}


/* ================= SIDEBAR LINK COMPONENT ================= */

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

export default MainLayout;