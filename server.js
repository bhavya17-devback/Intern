const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/database");

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Global Express Middleware
app.use(cors());
app.use(express.json());

// Feature-Based Modular Routes
app.use("/api/auth", require("./src/modules/auth/auth.routes"));
app.use("/api/donations", require("./src/modules/donation/donation.routes"));
app.use("/api/claims", require("./src/modules/claim/claim.routes"));
app.use("/api/admin", require("./src/modules/admin/admin.routes"));
app.use("/api/reports", require("./src/modules/report/report.routes"));
app.use("/api/subcategories", require("./src/modules/subcategory/subcategory.routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});