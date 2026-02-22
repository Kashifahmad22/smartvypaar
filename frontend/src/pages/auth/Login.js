import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="bg-[#111827] p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6">
          Login to SmartVyapaar
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full bg-blue-600 py-3 rounded font-semibold hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;