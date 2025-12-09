import { SerialPort, ReadlineParser } from "serialport";
import EventEmitter from "events";

export const serialEmitter = new EventEmitter();

const port = new SerialPort({
  path: "COM8", 
  baudRate: 115200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

let latestData: number[] | null = null;

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
