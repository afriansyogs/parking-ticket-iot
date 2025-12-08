import { SerialPort, ReadlineParser } from "serialport";

const port = new SerialPort({
  path: "COM8", 
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

export interface ParkingData {
  slot1: number;
  slot2: number;
  slot3: number;
  ticket?: number;
}

let latestData: ParkingData | null = null;

parser.on("data", (line: string) => {
  try {
    const json = JSON.parse(line);
    latestData = json;
    console.log("Data dari IoT:", latestData);
  } catch (e) {
    console.log("Invalid JSON:", line);
  }
});

export function getParkingData() {
  return latestData;
}
