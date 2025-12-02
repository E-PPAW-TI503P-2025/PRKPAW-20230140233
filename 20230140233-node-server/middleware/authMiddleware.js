const jwt = require("jsonwebtoken");

const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.auth = (req, res, next) => {
  try {
    const header = req.header("Authorization");

    if (!header) {
      return res.status(401).json({ message: "Token tidak ditemukan." });
    }

    const token = header.replace("Bearer ", "");

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token tidak valid atau sudah kadaluarsa."
    });
  }
};
