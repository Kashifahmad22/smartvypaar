import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BusinessProfile from "./pages/BusinessProfile";
import AddProductForm from "./components/AddProductForm";
import Insights from "./pages/Insights";
import Ledger from "./pages/Ledger";
import SalesHistory from "./pages/SalesHistory";


function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            token ? <MainLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="/add-product" element={<AddProductForm />} />
          <Route path="sales" element={<Sales />} />
          <Route path="business" element={<BusinessProfile />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/sales-history" element={<SalesHistory />} />  
        
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;