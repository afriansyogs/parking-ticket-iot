import express, { Request, Response } from "express";
import cors from "cors";
import { sseHandler } from "./sse";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

const tickerRoutes = require("../routes/Ticket");
const AuthRoutes = require("../routes/Auth");
const DashboardStashRoutes = require("../routes/DashboardStash");

app.use("/tickets", tickerRoutes);
app.get("/ticket-stream", sseHandler);
app.use("/auth", AuthRoutes);
app.use("/dashboard", DashboardStashRoutes);

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});