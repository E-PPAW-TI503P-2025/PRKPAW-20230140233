import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // <-- modal image

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let q = searchTerm ? `?nama=${searchTerm}` : "";
    fetchReports(q);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Check-Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Bukti Foto
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {p.user ? p.user.nama : "N/A"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(p.checkIn).toLocaleString("id-ID")}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {p.checkOut
                        ? new Date(p.checkOut).toLocaleString("id-ID")
                        : "Belum Check-Out"}
                    </td>

                    {/* Foto bisa diklik */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {p.buktiFotoUrl ? (
                        <img
                          src={p.buktiFotoUrl}
                          alt="Bukti"
                          onClick={() => setSelectedImage(p.buktiFotoUrl)}
                          className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:opacity-80"
                        />
                      ) : (
                        <span className="text-gray-400">Tidak ada foto</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Foto */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

export default ReportPage;
