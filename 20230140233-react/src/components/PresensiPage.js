import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon Leaflet
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

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  /* =============================
      GET LOCATION
  ============================== */
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

  /* =============================
          CHECK-IN
  ============================== */
  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    if (!coords) return setError("Lokasi tidak ditemukan.");

    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-in gagal.");
    }
  };

  /* =============================
          CHECK-OUT
  ============================== */
  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-out gagal.");
    }
  };

  /* =============================
              UI
  ============================== */

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-10">
      {isLoading ? (
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-6xl mb-8 text-center">
          <p className="text-xl font-semibold text-blue-600 animate-pulse">
            Memuat lokasi & peta...
          </p>
        </div>
      ) : (
        coords && (
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-6xl mb-8">
            <h3 className="text-xl font-semibold mb-2">Lokasi Anda:</h3>
            <div className="my-4 border rounded-lg overflow-hidden">
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={16}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>Lokasi Presensi Anda</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )
      )}

      {/* CHECK-IN / CHECK-OUT */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6">Presensi</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 bg-green-600 text-white rounded shadow hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 bg-red-600 text-white rounded shadow hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
