import React from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function DashboardPage() {
  const token = localStorage.getItem("token");

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch {
      user = null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            🎉 Selamat Datang kembali, {user ? user.nama : "Pengguna"}!
          </h1>
          <p className="text-slate-400 text-sm mt-0.5 font-medium">
            Sistem Informasi Presensi Digital siap digunakan. Silakan pilih menu di bawah ini.
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
          Role: {user ? user.role : "User"}
        </span>
      </div>

      {/* Grid Menu Navigasi Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Menuju Halaman Absen */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-4 font-bold text-lg">
              📍
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Pencatatan Kehadiran</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              Lakukan verifikasi lokasi berbasis koordinat GPS dan konfirmasi wajah via kamera untuk masuk kerja hari ini.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/presensi"
              className="inline-flex w-full items-center justify-center bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors tracking-wide uppercase"
            >
              Buka Presensi
            </Link>
          </div>
        </div>

        {/* Card 2: Menuju Laporan (Hanya jika admin, atau tampilkan rekap untuk user biasa) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-4 font-bold text-lg">
              📊
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {user?.role === "admin" ? "Data Laporan Admin" : "Riwayat Kehadiran"}
            </h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              {user?.role === "admin" 
                ? "Pantau, cari, dan tinjau seluruh rekapitulasi data kehadiran harian staf atau mahasiswa beserta foto bukti." 
                : "Lihat data rekap log presensi masuk dan keluar yang sudah kamu lakukan sebelumnya secara detail."}
            </p>
          </div>
          <div className="mt-6">
            <Link
              to={user?.role === "admin" ? "/reports" : "/presensi"}
              className="inline-flex w-full items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors border border-slate-200 tracking-wide uppercase"
            >
              {user?.role === "admin" ? "Lihat Semua Laporan" : "Cek Riwayat"}
            </Link>
          </div>
        </div>

        {/* Card 3: Informasi Status Hari Ini */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between bg-gradient-to-br from-slate-50 to-slate-100/50">
          <div>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-700 mb-4 font-bold text-lg shadow-sm">
              🗓️
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Status Sesi</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              Hari ini: <strong className="text-slate-700 font-semibold">{new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
            </p>
          </div>
          <div className="mt-6 text-center text-[10px] font-bold text-slate-400 tracking-wider uppercase border-t pt-4">
            Sistem Informasi Berjalan Lancar
          </div>
        </div>

      </div>
    </div>
  );
}