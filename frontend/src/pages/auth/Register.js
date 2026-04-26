import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { shopName, email, password }
      );

      alert("Registered successfully");
      navigate("/login");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="bg-[#111827] p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6">
          Register Your Shop
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Shop Name"
            className="w-full p-3 rounded bg-[#1f2937] text-white border border-gray-700"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-[#1f2937] text-white border border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-[#1f2937] text-white border border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 py-3 rounded font-semibold hover:bg-green-700"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;