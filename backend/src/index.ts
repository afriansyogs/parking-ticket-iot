import express, { Request, Response } from "express";
import { getParkingData } from "./serial";
import { Data, Res } from "./type";
import { randomBytes } from 'crypto';

const app = express();
const PORT = 3000;

function generateId(): string {
  return randomBytes(16).toString('hex');
}

app.get("/parking_status", (req: Request, res: Response) => {
  try {
    const kosong: number[] = getParkingData() || [];
    const noParking: number | null =  kosong?.length > 0 ? kosong[0] : null;
    console.log(` ini no parkirmu: ${noParking}`)
    const id: string = generateId()
    const date: Date  = new Date();
    
    const successResponse: Res<Data> = {
      message: "Success ticket",
      data: {
        id: id,
        slotKosong: kosong,
        noParking: noParking,
        date: date
      }
    };

    if (kosong.length === 0) successResponse.message = "Parkiran penuh";     
    
    console.log(successResponse);
    res.status(200).json(successResponse);
  } catch (error) {
    console.log(error)
    const errorResponse: Res<null> = {
      message: "Server error",
      data: null,
      errorMessage: (error as Error).message
    };
    return res.status(500).json(errorResponse);
  }
});

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});