import express, { Request, Response } from "express";
import { getParkingData } from "./serial";

const app = express();
const PORT = 3000;

app.get("/parking_status", (req: Request, res: Response) => {
  const kosong: number[] = getParkingData() || [];

  const noParking: number | null = kosong?.length > 0 ? kosong[0] : null;
  
  res.status(200).json({slot_kosong: kosong, noParking,});
});

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});