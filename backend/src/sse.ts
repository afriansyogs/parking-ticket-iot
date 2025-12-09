import { Request, Response } from "express";
import { serialEmitter } from "./serial";

export function sseHandler(req:Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  
}