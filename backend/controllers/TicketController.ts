import { Request, Response } from "express";
import { prisma } from '../lib/prisma'
import { getParkingData } from "../src/serial";
import { Data, Res } from "../types/type";
import { TicketStatus } from "../generated/prisma/enums";

const hourlyRate = 2000;

export const generateTicket = async () => {
  const kosong : number[] | null = getParkingData() || [];
  const slotParking: number | null =  kosong?.length > 0 ? kosong[0] : null;

  const newTicket = await prisma.ticket.create({
    data: {
      slotParking,
      status: TicketStatus.PENDING,
      entryTime: new Date(),
    },
  });

  const responseTicket: Pick<Data, "id" | "slotParking" | "entryTime" | "kosong"> = {
    id: newTicket.id,
    slotParking: newTicket.slotParking,
    entryTime: newTicket.entryTime,
    kosong: kosong
  };

  return responseTicket;
}

exports.createTicket = async (req: Request, res: Response) => {
  try {
    const newTicket : Pick<Data, "id" | "slotParking" | "entryTime"> = await generateTicket();

    const successResponse: Res<Pick<Data, "id" | "slotParking" | "entryTime">> = {
      message: "Success create ticket",
      data: newTicket
    };

    res.status(201).json(successResponse);
    return newTicket;
  } catch (error) {
    console.error(error);
    const errorResponse: Res<null> = {
      message: "Server error",
      data: null,
      errorMessage: (error as Error).message
    };
    return res.status(500).json(errorResponse);
  }
};

exports.checkFee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.status === "PAID") {
      return res.status(400).json({ 
        message: "Ticket already paid",
        data: ticket 
      });
    }

    const entryTime = new Date(ticket.entryTime);
    const exitTime = new Date(); 
    const diffMs = exitTime.getTime() - entryTime.getTime();
    let durationHours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (durationHours < 1) durationHours = 1;
    const totalPrice = durationHours * hourlyRate;

    const successResponse: Res<Data> = {
      message: "Success calculate parking price",
      data: {
        id: ticket.id,
        slotParking: ticket.slotParking,
        entryTime: ticket.entryTime,
        exitTime: exitTime,
        durationParking: diffMs,
        price: totalPrice,
        status: ticket.status
      },
    };
    res.status(200).json(successResponse);
  } catch (error) {
    console.error(error);
    const errorResponse: Res<null> = {
      message: "Failed calculate parking price",
      data: null,
      errorMessage: (error as Error).message
    };
    return res.status(500).json(errorResponse);
  }
};

exports.getAllTickets = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    let tickets;
    if (status === "ALL") {
      tickets = await prisma.ticket.findMany();
    } else {
      tickets = await prisma.ticket.findMany({
        where: { 
          status: status as TicketStatus
        }
      });
    }
    if (tickets.length === 0) {
      const noDataResponse: Res<null> = {
        message: "No tickets found",
        data: null
      };
      return res.status(404).json(noDataResponse);
    }
    res.status(200).json({message: "Success get all tickets", data: tickets});
  } catch (error) {
    console.error(error);
    const errorResponse: Res<null> = {
      message: "Failed get tickets",
      data: null,
      errorMessage: (error as Error).message
    };
    return res.status(500).json(errorResponse);
  }
};

export const searchTicketById = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const tickets = await prisma.ticket.findMany({
      where: { 
        id: id
      }
    });
    if (tickets.length === 0) {
      const noDataResponse: Res<null> = {
        message: "No tickets found",
        data: null
      };
      return res.status(404).json(noDataResponse);
    }
    res.status(200).json({message: "Success get all tickets", data: tickets});
  } catch (error) {
    console.error(error);
    const errorResponse: Res<null> = {
      message: "Failed get tickets",
      data: null,
      errorMessage: (error as Error).message
    };
    return res.status(500).json(errorResponse);
  }
}

export const totalParking = async (req: Request, res: Response) => {
  try {
    const revenue = await prisma.ticket.aggregate({
      _sum: {
        price: true,
      }
    })
    
    const totalPending = await prisma.ticket.count({
      where: {
        status: TicketStatus.PENDING,
      },
    });
    
    const total = {
      revenue : revenue._sum.price || 0,
      totalPending
    }
    res.status(200).json({message: "Success get all tickets", data: total});
  } catch (error) {
    console.error(error);
    const errorResponse: Res<null> = {
      message: "Failed get tickets",
      data: null,
      errorMessage: (error as Error).message
    };
    return res.status(500).json(errorResponse);
  }
}

exports.payTicket = async (req: Request, res: Response) => {
  try {
    const { id, price, durationParking } = req.body; 

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        status: TicketStatus.PAID,
        price: Number(price),
        exitTime: new Date(),
        durationParking: durationParking,
      },
    });

    const successResponse: Res<Data> = {
      message: "Payment success.",
      data: ticket
    };
    res.status(200).json(successResponse);
  } catch (error) {
    console.error(error);
    const errorResponse: Res<null> = {
      message: "Payment Failed",
      data: null,
      errorMessage: (error as Error).message
    };
    return res.status(500).json(errorResponse);
  }
};