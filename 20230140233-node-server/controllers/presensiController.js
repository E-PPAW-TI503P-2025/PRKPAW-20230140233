const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

/* ============================
   CHECK-IN
============================= */
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body; // ← LOKASI DARI FRONTEND

    // Cek apakah sudah check-in
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({
        message: "Anda sudah melakukan check-in hari ini.",
      });
    }

    // Buat record baru
    const newRecord = await Presensi.create({
      userId,
      nama: userName,
      checkIn: waktuSekarang,
      latitude,
      longitude,
    });

    const formattedData = {
      userId: newRecord.userId,
      nama: newRecord.nama,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
      latitude: newRecord.latitude,
      longitude: newRecord.longitude,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

/* ============================
   CHECK-OUT
============================= */
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      nama: recordToUpdate.nama,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      latitude: recordToUpdate.latitude,
      longitude: recordToUpdate.longitude,
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

/* ============================
   DELETE PRESENSI
============================= */
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;

    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({
        message: "Catatan presensi tidak ditemukan.",
      });
    }

    if (recordToDelete.userId !== userId) {
      return res.status(403).json({
        message: "Akses ditolak: Anda bukan pemilik catatan ini.",
      });
    }

    await recordToDelete.destroy();

    return res.status(200).json({
      message: `Data presensi dengan ID ${presensiId} berhasil dihapus.`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

/* ============================
   UPDATE PRESENSI
============================= */
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama, latitude, longitude } = req.body;

    const recordToUpdate = await Presensi.findByPk(presensiId);

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Catatan presensi tidak ditemukan.",
      });
    }

    // Update field jika disediakan
    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;
    recordToUpdate.latitude = latitude || recordToUpdate.latitude;
    recordToUpdate.longitude = longitude || recordToUpdate.longitude;

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
