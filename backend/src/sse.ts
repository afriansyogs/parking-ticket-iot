import { Request, Response } from "express";
import { serialEmitter } from "./serial";
import { generateTicket } from "./ticketService";

export function sseHandler(req:Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log("test sse")

  const sendTicket = () => {
    const ticket = generateTicket();
    res.write(`event: ticket\n`);
    res.write(`data: ${JSON.stringify(ticket)}\n\n`);
    console.log(`ini ticket ${ticket}`)
  };

  serialEmitter.on("buttonPressed", sendTicket);

  req.on("close", () => {
    serialEmitter.off("buttonPressed", sendTicket);
    console.log("SSE closed");
  });
}