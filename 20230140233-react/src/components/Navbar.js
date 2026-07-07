import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch {
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800 shadow-sm">
      {/* Menu Navigasi Kiri */}
      <div className="flex space-x-6 text-sm font-medium tracking-wide">
        <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">
          Dashboard
        </Link>
        <Link to="/presensi" className="text-slate-300 hover:text-white transition-colors">
          Presensi
        </Link>

        {user?.role === "admin" && (
          <Link to="/reports" className="text-slate-300 hover:text-white transition-colors">
            Laporan Admin
          </Link>
        )}
      </div>

      {/* Profile & Logout Kanan */}
      <div className="flex items-center space-x-4 text-sm">
        {user && (
          <span className="text-slate-400 font-medium">
            Halo, <strong className="text-slate-200 font-semibold">{user.nama}</strong>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors shadow-sm tracking-wide"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
}

export default Navbar;