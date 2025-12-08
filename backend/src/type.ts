export interface Res<T> {
  status: number;
  message: string;
  data: T;
  errorMessage?: string;
}

export interface Data {
  id: string;
  slotKosong: number[];
  noParking: number | null;
  date: Date;
}