import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import accountRoutes from "./routes/account.routes";
import transanctionRoutes from "./routes/transanction.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/accounts", accountRoutes);
app.use("/transanctions", transanctionRoutes);
app.use("/api", dashboardRoutes);


// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Banking Portal API Running..." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
