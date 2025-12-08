export interface Response<T> {
  status: number;
  message: string;
  data: T;
  errorMessage?: string;
}

export interface Data {
  slot_kosong: number[];
  noParking: number | null;
}