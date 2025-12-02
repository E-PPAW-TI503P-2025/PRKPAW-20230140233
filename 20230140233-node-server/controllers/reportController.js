const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggal } = req.query;

    let options = {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "email", "role"], // AMBIL NAMA DI SINI
        },
      ],
      where: {},
      order: [["checkIn", "DESC"]],
    };

    // Filter berdasarkan nama
    if (nama) {
      options.include[0].where = {
        nama: { [Op.like]: `%${nama}%` },
      };
    }

    // Filter berdasarkan tanggal
    if (tanggal) {
      const start = new Date(`${tanggal} 00:00:00`);
      const end = new Date(`${tanggal} 23:59:59`);

      options.where.checkIn = { [Op.between]: [start, end] };
    }

    const records = await Presensi.findAll(options);

    res.json({
      message: "Laporan harian berhasil diambil",
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
