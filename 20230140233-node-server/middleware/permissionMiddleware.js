exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    console.log("Middleware: Izin admin diberikan.");
    return next();
  }

  console.log("Middleware: Gagal! Pengguna bukan admin.");
  return res.status(403).json({
    message: "Akses ditolak: Hanya untuk admin"
  });
};
