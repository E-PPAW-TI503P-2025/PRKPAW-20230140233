import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Webcam from "react-webcam";

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

// ===============================
//   BASE64 → REAL FILE FIX
// ===============================
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

  // camera
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
  }, [webcamRef]);

  const getToken = () => localStorage.getItem("token");

  // ===============================
  //         GET LOCATION
  // ===============================
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

  // ===============================
  //     CHECK-IN (WITH FOTO)
  // ===============================
  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    if (!coords) return setError("Lokasi tidak ditemukan.");
    if (!image) return setError("Foto wajib diambil dulu.");

    try {
      // BASE64 → FILE (Fix utama)
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

  // ===============================
  //        CHECK-OUT
  // ===============================
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-10">

      {/* MAP / LOKASI */}
      {isLoading ? (
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-6xl mb-8 text-center">
          <p className="text-xl font-semibold text-blue-600 animate-pulse">
            Memuat lokasi & peta...
          </p>
        </div>
      ) : coords ? (
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
      ) : null}

      {/* CAMERA SECTION */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-6xl mb-8">
        <h3 className="text-xl font-semibold mb-4">Ambil Foto Selfie</h3>

        <div className="my-4 border rounded-lg overflow-hidden bg-black">
          {image ? (
            <img src={image} alt="Selfie" className="w-full" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          )}
        </div>

        {/* BUTTON AMBIL FOTO */}
        <div className="mb-4">
          {!image ? (
            <button
              onClick={capture}
              className="bg-blue-500 text-white px-4 py-3 rounded w-full"
            >
              Ambil Foto 📸
            </button>
          ) : (
            <button
              onClick={() => setImage(null)}
              className="bg-gray-500 text-white px-4 py-3 rounded w-full"
            >
              Ulangi Foto 🔄
            </button>
          )}
        </div>
      </div>

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
