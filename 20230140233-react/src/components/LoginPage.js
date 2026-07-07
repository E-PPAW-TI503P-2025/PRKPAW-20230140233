import React, { useState } from "react";
import axios from "axios"; // Sudah diperbaiki
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Login gagal");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/60 max-w-md w-full">
        
        {/* Header Login */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shadow-md shadow-slate-200 mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Selamat Datang
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Masuk untuk mengakses Sistem Presensi Digital
          </p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Alamat Email
            </label>
            <input
              type="email"
              required
              className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Masukkan email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium text-center">
              ⚠️ {error}
            </div>
          )}

          <button className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition-colors text-sm tracking-wide mt-2">
            Masuk Aplikasi
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 mt-6 font-medium">
          Belum punya akun?{" "}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
            Daftar di sini
          </Link>
        </p>

      </div>
    </div>
  );
}