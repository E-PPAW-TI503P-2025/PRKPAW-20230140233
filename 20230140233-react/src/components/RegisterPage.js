import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        email,
        password,
        role,
      });

      alert("Registrasi berhasil!");
      navigate("/login");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/60 max-w-md w-full">
        
        {/* Header Register */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Buat Akun
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Daftarkan diri Anda ke Sistem Presensi Digital
          </p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Alamat Email
            </label>
            <input
              type="email"
              required
              className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email..."
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hak Akses (Role)
            </label>
            <select
              className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium text-center">
              ⚠️ {error}
            </div>
          )}

          <button className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition-colors text-sm tracking-wide mt-2">
            Daftar Akun
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 mt-6 font-medium">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
            Login di sini
          </Link>
        </p>

      </div>
    </div>
  );
}