import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ perbaikan import

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
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between">
      <div className="flex space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/presensi" className="hover:underline">Presensi</Link>

        {user?.role === "admin" && (
          <Link to="/reports" className="hover:underline">Laporan Admin</Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user && <span>Halo, {user.nama}</span>}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
