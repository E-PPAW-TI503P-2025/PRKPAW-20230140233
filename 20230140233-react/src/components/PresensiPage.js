import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Webcam from "react-webcam";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function base64ToFile(base64, filename) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
  }, [webcamRef]);

  const getToken = () => localStorage.getItem("token");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    if (!coords) return setError("Lokasi tidak ditemukan.");
    if (!image) return setError("Foto wajib diambil dulu.");

    try {
      const file = base64ToFile(image, "selfie.jpg");
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", file);

      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-in gagal.");
    }
  };

  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-out gagal.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Presensi Digital
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium tracking-wide uppercase">
              Verifikasi Kehadiran Kerja
            </p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      <div className="max-w-7xl mx-auto mb-6">
        {message && (
          <div className="p-4 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl font-medium text-center text-sm shadow-sm">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-medium text-center text-sm shadow-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Card: Location */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1.5 h-4 bg-slate-700 rounded-full"></div>
              <h3 className="text-base font-bold text-slate-700">Lokasi Anda</h3>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-inner bg-slate-50 min-h-[350px] flex flex-col justify-center relative border border-slate-200/40">
              {isLoading ? (
                <div className="text-center p-10">
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-8 h-8 border-3 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
                    <p className="text-xs font-semibold text-slate-500">
                      Mendeteksi koordinat...
                    </p>
                  </div>
                </div>
              ) : coords ? (
                <MapContainer
                  center={[coords.lat, coords.lng]}
                  zoom={16}
                  style={{ height: "350px", width: "100%" }}
                  className="z-10"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <Marker position={[coords.lat, coords.lng]}>
                    <Popup className="font-medium text-slate-700">
                      Lokasi Anda Saat Ini
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="text-center p-10">
                  <p className="text-slate-400 text-xs font-medium">
                    Gagal mendeteksi lokasi. Pastikan izin GPS aktif.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {coords && !isLoading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-mono text-slate-500">
              <span>LAT: {coords.lat.toFixed(6)}</span>
              <span className="text-slate-300">|</span>
              <span>LNG: {coords.lng.toFixed(6)}</span>
            </div>
          )}
        </div>

        {/* Right Card: Webcam / Selfie */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1.5 h-4 bg-slate-700 rounded-full"></div>
              <h3 className="text-base font-bold text-slate-700">Verifikasi Wajah</h3>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-900 flex justify-center items-center aspect-video relative mb-4 shadow-inner border border-slate-900">
              {image ? (
                <img
                  src={image}
                  alt="Selfie"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover opacity-95"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                  }}
                />
              )}
            </div>

            <div className="mb-6">
              {!image ? (
                <button
                  onClick={capture}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Ambil Foto Selfie
                </button>
              ) : (
                <button
                  onClick={() => setImage(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2"
                >
                  Ulangi Ambil Gambar
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons (Check-In & Check-Out) */}
          <div className="border-t border-slate-100 pt-5 mt-auto">
            <p className="text-[10px] font-bold text-slate-400 mb-3 text-center tracking-widest uppercase">
              Aksi Kehadiran
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleCheckIn}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm tracking-wide"
              >
                Check-In
              </button>

              <button
                onClick={handleCheckOut}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-sm transition-colors text-sm tracking-wide"
              >
                Check-Out
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PresensiPage;