import { getParkingData } from "./serial";
import { randomBytes } from 'crypto';
import { Data } from "./type";

function generateId(): string {
  return randomBytes(16).toString('hex');
}

export function generateTicket() : Data {
  const kosong : number[] | null = getParkingData() || [];
  const noParking: number | null =  kosong?.length > 0 ? kosong[0] : null;
  
  return {
    id: generateId(),
    slotKosong: kosong,
    noParking,
    date: new Date().toISOString(),
  };
}