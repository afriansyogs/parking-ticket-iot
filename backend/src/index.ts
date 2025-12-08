import express, { Request, Response } from "express";
import { getParkingData } from "./serial";
import { Data, Res } from "./type";
import { randomBytes } from 'crypto';

const app = express();
const PORT = 3000;

function generateId(): string {
  return randomBytes(16).toString('hex');
}

app.get("/parking_status", async (req: Request, res: Response) => {
  try {
    const kosong: number[] = await getParkingData() || [];
    const noParking: number | null = await kosong?.length > 0 ? kosong[0] : null;
    console.log(` ini no parkirmu: ${noParking}`)
    const id: string = generateId()
    const date: Date  = new Date();
    const response: Res<Data> = {
      status: 200,
      message: "Success ticket",
      data: {
        id: id,
        slotKosong: kosong,
        noParking: noParking,
        date: date
      }
    };
    console.log(response);
    res.json(response);
  } catch (error) {
    console.log(error)
  }
});

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});