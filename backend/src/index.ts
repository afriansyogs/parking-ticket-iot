import express, { Request, Response } from "express";
import { getParkingData } from "./serial";

const app = express();
const PORT = 3000;

app.get("/parking_status", (req: Request, res: Response) => {
  const data = getParkingData();

  if (!data) return res.json({ status: "belum ada data" });

  const kosong: number[] = [];
  for (let i = 1; i <= 3; i++) {
    if (data[`slot${i}` as keyof typeof data] === 0) {
      kosong.push(i);
    }
  }

  const noParking = kosong.length > 0 ? kosong[0] : null;

  res.json({
    data,
    slot_kosong: kosong,
    noParking,
  });
});

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});