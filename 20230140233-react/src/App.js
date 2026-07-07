import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import PresensiPage from "./components/PresensiPage";  
import ReportPage from "./components/ReportPage";
import Navbar from "./components/Navbar";

// Leaflet CSS tetap dipertahankan karena berguna jika sistem presensi kamu menggunakan peta/lokasi (geolocation)
import "leaflet/dist/leaflet.css";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Publik */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Utama */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />

        {/* Halaman Melakukan Presensi */}
        <Route
          path="/presensi"
          element={
            <MainLayout>
              <PresensiPage />
            </MainLayout>
          }
        />

        {/* Rekap Laporan Presensi */}
        <Route
          path="/reports"
          element={
            <MainLayout>
              <ReportPage />
            </MainLayout>
          }
        />

        {/* Route Default (Langsung diarahkan ke Login saat web dibuka) */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;