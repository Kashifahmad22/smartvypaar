import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Building2,
  PlusCircle,
  BookOpen,
  FileText,
  Brain,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";

function MainLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= THEME STATE ================= */
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  /* ================= APPLY THEME ================= */
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ================= GLOBAL DESIGN SYSTEM ================= */
  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      /* ================= ANIMATIONS ================= */

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }

      /* ================= INPUT SYSTEM ================= */

      .sv-input {
        width: 100%;
        padding: 0.65rem 0.9rem;
        border-radius: 0.75rem;
        font-size: 0.875rem;
        border: 1px solid rgb(209 213 219);
        background: white;
        color: rgb(17 24 39);
        transition: all 0.2s ease;
        outline: none;
      }

      select.sv-input {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
      }

      .dark .sv-input {
        background: rgb(31 41 55);
        border: 1px solid rgb(55 65 81);
        color: rgb(243 244 246);
      }

      .sv-input::placeholder {
        color: rgb(107 114 128);
      }

      .dark .sv-input::placeholder {
        color: rgb(156 163 175);
      }

      .sv-input:focus {
        border-color: rgb(79 70 229);
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.25);
      }

      .dark .sv-input:focus {
        border-color: rgb(129 140 248);
        box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.25);
      }

      /* ================= BUTTON SYSTEM ================= */

      .sv-btn-primary {
        background: rgb(79 70 229);
        color: white;
        padding: 0.65rem 1.2rem;
        border-radius: 0.75rem;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .sv-btn-primary:hover {
        background: rgb(67 56 202);
      }

      .sv-btn-danger {
        background: rgb(220 38 38);
        color: white;
        padding: 0.65rem 1.2rem;
        border-radius: 0.75rem;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .sv-btn-danger:hover {
        background: rgb(185 28 28);
      }

      /* ================= CARD SYSTEM ================= */

      .sv-card {
        background: white;
        border: 1px solid rgb(229 231 235);
        border-radius: 1rem;
        padding: 1.5rem;
        transition: all 0.2s ease;
      }

      .dark .sv-card {
        background: #111827;
        border: 1px solid rgb(31 41 55);
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  /* ================= BODY SCROLL CONTROL ================= */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64
          bg-white dark:bg-[#111827]
          border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full p-6">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                SmartVyapaar
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Retail Intelligence
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1 flex-1">
            <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarLink to="/insights" icon={<Brain size={18} />} label="Smart Insights" />
            <SidebarLink to="/inventory" icon={<Package size={18} />} label="Inventory" />
            <SidebarLink to="/add-product" icon={<PlusCircle size={18} />} label="Add Product" />
            <SidebarLink to="/sales" icon={<ShoppingCart size={18} />} label="Sales" />
            <SidebarLink to="/sales-history" icon={<FileText size={18} />} label="Sales History" />
            <SidebarLink to="/ledger" icon={<BookOpen size={18} />} label="Ledger" />
            <SidebarLink to="/business" icon={<Building2 size={18} />} label="Business" />
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 mt-6 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
          >
            <LogOut size={16} />
            Logout
          </button>

          <div className="text-xs text-gray-400 mt-6">
            © 2026 SmartVyapaar
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a]">

          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="text-lg font-semibold hidden md:block">
            Dashboard
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105 transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default MainLayout;