export interface Ticket {
  id: string;
  noParking: number | null;
  slotKosong: number[];
  date: string;
}