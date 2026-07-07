import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const fetchReports = async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await axios.get(
        `http://localhost:3001/api/reports/daily${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReports(res.data.data);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data"
      );
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let q = searchTerm ? `?nama=${searchTerm}` : "";
      fetchReports(q);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let q = searchTerm ? `?nama=${searchTerm}` : "";
    fetchReports(q);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 bg-slate-800 rounded-xl flex items-center justify-center shadow-md shadow-slate-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2a4 4 0 01-4-4H5a4 4 0 01-4 4v2m6.5-7a3 3 0 11-6 0 3 3 0 016 0zm6.5 0a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Laporan Presensi Harian
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium tracking-wide uppercase">
              Database Kehadiran Utama
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
          />
        </div>
        <button
          type="submit"
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          Cari Data
        </button>
      </form>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium text-center mb-4">
          Gagal memuat data: {error}
        </div>
      )}

      {/* Table Section */}
      {!error && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="p-4 pl-6">Nama</th>
                  <th className="p-4">Check-In</th>
                  <th className="p-4">Check-Out</th>
                  <th className="p-4 pr-6 text-center">Bukti Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {reports.length > 0 ? (
                  reports.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors duration-150">
                      <td className="p-4 pl-6 font-semibold text-slate-700">
                        {p.user ? p.user.nama : "N/A"}
                      </td>

                      <td className="p-4 text-slate-500 font-medium">
                        {p.checkIn ? new Date(p.checkIn).toLocaleString("id-ID") : "-"}
                      </td>

                      <td className="p-4">
                        {p.checkOut ? (
                          <span className="text-slate-500 font-medium">
                            {new Date(p.checkOut).toLocaleString("id-ID")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                            Aktif (Belum Check-Out)
                          </span>
                        )}
                      </td>

                      <td className="p-4 pr-6 flex justify-center">
                        {p.buktiFotoUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
                            <img
                              src={p.buktiFotoUrl}
                              alt="Bukti"
                              onClick={() => setSelectedImage(p.buktiFotoUrl)}
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200/40 flex flex-col items-center justify-center text-[10px] font-medium text-slate-400">
                            Tidak Ada
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-12 text-slate-400 font-medium text-sm">
                      Tidak ada rekaman presensi yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-2xl max-h-[80vh] bg-white p-1.5 rounded-2xl shadow-xl overflow-hidden">
            <img
              src={selectedImage}
              alt="Preview"
              className="rounded-xl max-h-[75vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;