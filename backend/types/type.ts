import { Decimal } from "@prisma/client/runtime/client";
import { TicketStatus } from "../generated/prisma/enums";

export interface Res<T> {
  message: string;
  data: T;
  errorMessage?: string;
}

export interface Data {
  id: string;
  kosong?: number[]
  slotParking: number;
  status: TicketStatus;
  entryTime: Date;
  exitTime: Date | null;
  durationParking: Decimal | null;
  price?: number;
}

export interface TicketWithStatus {
  id: string;
  kosong?: number[]
  slotParking: number;
  status: StatusOptions;
  entryTime: Date;
  exitTime: Date | null;
  durationParking: Decimal | null;
  price?: number;
}

export enum StatusOptions {
  ALL = 'ALL',
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface User {
  id : string;
  username : string;
  email : string;
  role: string;
}