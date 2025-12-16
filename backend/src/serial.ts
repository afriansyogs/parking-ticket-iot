import { SerialPort, ReadlineParser } from "serialport";
import EventEmitter from "events";

export const serialEmitter = new EventEmitter();

const port = new SerialPort({
  path: "COM8", 
  baudRate: 115200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

let latestData: number[] | null = null;

parser.on("data", (raw: string) => {
  try {
    const json = JSON.parse(raw);
    if (json.button === 1) {
      console.log("button from iot");
      serialEmitter.emit("buttonPressed");
    }
    latestData = json;
    console.log("Data dari IoT:", latestData);
  } catch (e) {
    console.log("Invalid JSON:", raw);
  }
});

export function getParkingData() {
  return latestData;
}
