const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();
const PORT = 3001;




// Middleware global
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ⬅️ TARUH STATIC DISINI (SETELAH express.json)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTERS
const authRoutes = require("./routes/auth");
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const bookRoutes = require("./routes/books");

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/books", bookRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
