export type Ticket = {
  id: string;
  slotParking: number | null;
  kosong?: number[];
  entryTime: string;
}

export interface Data {
  id: string;
  slotParking: number;
  status: TicketStatus;
  entryTime: Date;
  exitTime?: Date;
  durationParking: number;
  price?: number;
}

export type TicketData = {
  id: string
  slotParking: number
  entryTime: string
  exitTime: string | null
  durationParking: number | null
  price: number
  status: TicketStatus;
};

export enum TicketStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum StatusOptions {
  ALL = 'ALL',
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export type UserLogin = {
  username: string
  password: string
}

export type NewUser = {
  username: string
  email: string
  password: string
  passwordConfirm: string
}

export type usernameEmailRole = {
  username: string
  email: string
  role: string
}

export type TotalParking = {
  revenue: number
  totalPending: number
}

export type StashCard = {
  totalToday: number
  totalPending: number
  totalPrice:  number
  totalUser: number
}