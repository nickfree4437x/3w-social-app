const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { APP_NAME, API_VERSION } = require("./constants");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/posts`, postRoutes);

app.get("/", (req, res) => {
  res.send(`${APP_NAME} Backend Running`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
