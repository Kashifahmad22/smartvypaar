diff --git a/frontend/src/layout/MainLayout.js b/frontend/src/layout/MainLayout.js
index c232fa61c95953a93b6b2738e0d3518dbaa541da..7e8773a55d86cc27f1cbbe7ee8f886ed6ff72ae6 100644
--- a/frontend/src/layout/MainLayout.js
+++ b/frontend/src/layout/MainLayout.js
@@ -1,290 +1,276 @@
 import { useEffect, useState } from "react";
 import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
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
-  Sun,
-  Moon,
+  UserRound,
+  Sparkles,
   Menu,
-  X
+  X,
+  Store
 } from "lucide-react";
 
 function MainLayout() {
   const navigate = useNavigate();
   const location = useLocation(); // ✅ Added
   const [sidebarOpen, setSidebarOpen] = useState(false);
 
   /* ================= THEME STATE ================= */
-  const [theme, setTheme] = useState(
-    () => localStorage.getItem("theme") || "dark"
-  );
+  const theme = "dark";
 
   /* ================= APPLY THEME ================= */
   useEffect(() => {
     if (theme === "dark") {
       document.documentElement.classList.add("dark");
     } else {
       document.documentElement.classList.remove("dark");
     }
     localStorage.setItem("theme", theme);
   }, [theme]);
 
   /* ================= PAGE TITLE LOGIC ================= */
   const getPageTitle = () => {
     const path = location.pathname;
 
     if (path === "/") return "Dashboard";
     if (path === "/insights") return "Smart Insights";
     if (path === "/inventory") return "Inventory";
     if (path === "/add-product") return "Add Product";
     if (path === "/sales") return "Sales";
     if (path === "/sales-history") return "Sales History";
     if (path === "/ledger") return "Ledger";
     if (path === "/business") return "Business Profile";
 
     return "SmartVyapaar";
   };
 
   /* ================= GLOBAL DESIGN SYSTEM ================= */
   useEffect(() => {
     const style = document.createElement("style");
 
     style.innerHTML = `
       @keyframes fadeIn {
         from { opacity: 0; transform: translateY(8px); }
         to { opacity: 1; transform: translateY(0); }
       }
 
       .animate-fadeIn {
         animation: fadeIn 0.5s ease-out;
       }
 
       .sv-input {
         width: 100%;
         padding: 0.65rem 0.9rem;
-        border-radius: 0.75rem;
+        border-radius: 0.8rem;
         font-size: 0.875rem;
-        border: 1px solid rgb(209 213 219);
-        background: white;
-        color: rgb(17 24 39);
+        border: 1px solid rgba(39, 52, 84, 0.9);
+        background: rgba(12, 20, 37, 0.8);
+        color: rgb(229 231 235);
         transition: all 0.2s ease;
         outline: none;
       }
 
       select.sv-input {
         appearance: none;
         -webkit-appearance: none;
         -moz-appearance: none;
         cursor: pointer;
       }
 
-      .dark .sv-input {
-        background: rgb(31 41 55);
-        border: 1px solid rgb(55 65 81);
-        color: rgb(243 244 246);
-      }
-
       .sv-input::placeholder {
-        color: rgb(107 114 128);
+        color: rgb(100 116 139);
       }
 
       .dark .sv-input::placeholder {
         color: rgb(156 163 175);
       }
 
       .sv-input:focus {
-        border-color: rgb(79 70 229);
-        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.25);
-      }
-
-      .dark .sv-input:focus {
-        border-color: rgb(129 140 248);
-        box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.25);
+        border-color: rgb(20 184 166);
+        box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
       }
 
       .sv-btn-primary {
-        background: rgb(79 70 229);
-        color: white;
+        background: linear-gradient(90deg, #10b981 0%, #22d3ee 100%);
+        color: #03121f;
         padding: 0.65rem 1.2rem;
-        border-radius: 0.75rem;
+        border-radius: 0.8rem;
         font-weight: 600;
         transition: all 0.2s ease;
       }
 
       .sv-btn-primary:hover {
-        background: rgb(67 56 202);
+        filter: brightness(1.05);
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
 
       .sv-card {
-        background: white;
-        border: 1px solid rgb(229 231 235);
-        border-radius: 1rem;
+        background: linear-gradient(180deg, rgba(14,21,37,0.96) 0%, rgba(10,16,28,0.96) 100%);
+        border: 1px solid rgba(38, 52, 80, 0.75);
+        border-radius: 1.05rem;
         padding: 1.5rem;
         transition: all 0.2s ease;
-      }
-
-      .dark .sv-card {
-        background: #111827;
-        border: 1px solid rgb(31 41 55);
+        box-shadow: 0 12px 30px rgba(3, 7, 18, 0.45);
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
 
-  const toggleTheme = () => {
-    setTheme(prev => (prev === "dark" ? "light" : "dark"));
-  };
-
   const handleLogout = () => {
     localStorage.removeItem("token");
     navigate("/login");
   };
 
   return (
-    <div className="flex min-h-screen bg-gray-100 dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 transition-colors duration-300">
+    <div className="flex min-h-screen bg-[#070b16] text-gray-100 transition-colors duration-300">
 
       {sidebarOpen && (
         <div
           onClick={() => setSidebarOpen(false)}
           className="fixed inset-0 bg-black/40 z-30 md:hidden"
         />
       )}
 
       <aside
         className={`
           fixed md:static inset-y-0 left-0 z-40 w-64
-          bg-white dark:bg-[#111827]
-          border-r border-gray-200 dark:border-gray-800
+          bg-[#0b111d]
+          border-r border-[#1b2436]
           transform transition-transform duration-300
           ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
         `}
       >
         <div className="flex flex-col h-full p-6">
 
-          <div className="flex items-center justify-between mb-8">
-            <div>
+          <div className="flex items-center justify-between mb-8 pb-5 border-b border-[#1b2436]">
+            <div className="flex items-center gap-2">
+              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 text-black flex items-center justify-center">
+                <Store size={15} />
+              </div>
               <h1 className="text-lg font-bold tracking-tight">
-                SmartVyapaar
+                Smart<span className="text-emerald-400">Vyapaar</span>
               </h1>
-              <p className="text-xs text-gray-500 mt-1">
-                Retail Intelligence
-              </p>
             </div>
 
             <button
               onClick={() => setSidebarOpen(false)}
               className="md:hidden"
             >
               <X size={20} />
             </button>
           </div>
 
+          <div className="rounded-2xl border border-[#243044] bg-[#0d1526] p-4 mb-7">
+            <div className="w-14 h-14 rounded-full border border-emerald-400/40 bg-[#0a1a22] flex items-center justify-center">
+              <UserRound size={24} className="text-emerald-300" />
+            </div>
+            <p className="text-xs text-gray-400 mt-3">Welcome back,</p>
+            <p className="font-semibold">SmartVyapaar User</p>
+          </div>
+
           <nav className="space-y-1 flex-1">
             <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
-            <SidebarLink to="/insights" icon={<Brain size={18} />} label="Smart Insights" />
             <SidebarLink to="/inventory" icon={<Package size={18} />} label="Inventory" />
+            <SidebarLink to="/sales-history" icon={<ShoppingCart size={18} />} label="Sales Tracking" />
+            <SidebarLink to="/business" icon={<Building2 size={18} />} label="Party (Customers)" />
+            <SidebarLink to="/ledger" icon={<BookOpen size={18} />} label="Udhaar (Ledger)" />
+            <SidebarLink to="/insights" icon={<Brain size={18} />} label="AI Insights" />
             <SidebarLink to="/add-product" icon={<PlusCircle size={18} />} label="Add Product" />
-            <SidebarLink to="/sales" icon={<ShoppingCart size={18} />} label="Sales" />
-            <SidebarLink to="/sales-history" icon={<FileText size={18} />} label="Sales History" />
-            <SidebarLink to="/ledger" icon={<BookOpen size={18} />} label="Ledger" />
-            <SidebarLink to="/business" icon={<Building2 size={18} />} label="Business" />
+            <SidebarLink to="/sales" icon={<FileText size={18} />} label="Record Sale" />
           </nav>
 
           <button
             onClick={handleLogout}
-            className="flex items-center gap-3 px-4 py-2 mt-6 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
+            className="flex items-center gap-3 px-4 py-2 mt-6 rounded-xl border border-[#263047] text-gray-300 hover:text-white hover:bg-[#111a2e] text-sm transition"
           >
             <LogOut size={16} />
             Logout
           </button>
 
           <div className="text-xs text-gray-400 mt-6">
             © 2026 SmartVyapaar
           </div>
         </div>
       </aside>
 
-      <div className="flex-1 flex flex-col">
+      <div className="flex-1 flex flex-col bg-[radial-gradient(circle_at_50%_0%,rgba(40,58,101,0.25),transparent_60%)]">
 
-        <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a]">
+        <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[#1b2436] bg-transparent">
 
           <button
             onClick={() => setSidebarOpen(true)}
             className="md:hidden"
           >
             <Menu size={20} />
           </button>
 
           <div className="text-lg font-semibold hidden md:block">
             {getPageTitle()}
           </div>
 
-          <button
-            onClick={toggleTheme}
-            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105 transition"
-          >
-            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
-          </button>
+          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
+            <Sparkles size={13} />
+            AI Enabled
+          </div>
         </header>
 
-        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
+        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
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
-            ? "bg-blue-600 text-white"
-            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
+            ? "bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 text-emerald-300 border border-emerald-500/30"
+            : "text-gray-400 hover:text-gray-200 hover:bg-[#111a2e]"
         }`
       }
     >
       {icon}
       <span>{label}</span>
     </NavLink>
   );
 }
 
-export default MainLayout;
\ No newline at end of file
+export default MainLayout;
