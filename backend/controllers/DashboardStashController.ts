import { Request, Response } from "express";
import { prisma } from '../lib/prisma'
import { Data, Res } from "../types/type";
import { TicketStatus } from "../generated/prisma/enums";
import { generateTicket } from "./TicketController";
import { getParkingData } from "../src/serial";

exports.getDashboardTicketStats = async (req: Request, res: Response) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const totalToday = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const totalPending = await prisma.ticket.count({
      where: {
        status: TicketStatus.PENDING,
      },
    });

    const totalPrice = await prisma.ticket.aggregate({
      _sum: {
        price: true,
      },
      where: {
        status: TicketStatus.PAID,
      },
    });

    const totalUser = await prisma.user.count();

    const dashboardData = {
      totalToday,
      totalPending,
      totalPrice: totalPrice._sum.price || 0,
      totalUser,
    };

    return res.status(200).json({
      message: "Dashboard stats fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch dashboard stats",
      data: null,
      errorMessage: (error as Error).message,
    });
  }
};

export const getRevenueLastWeek = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const tickets = await prisma.ticket.findMany({
      where: {
        status: TicketStatus.PAID,
        exitTime: { gte: sevenDaysAgo, lte: today },
      },
      select: {
        price: true,
        exitTime: true,
      },
    });

    // array 7 hari terakhir
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      return date;
    });

    // pendapatan per hari
    const revenueData = last7Days.map(day => {
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);

      const total = tickets
        .filter(t => t.exitTime >= startOfDay && t.exitTime <= endOfDay)
        .reduce((sum, t) => sum + t.price, 0);

      return total;
    });

    const labels = last7Days.map(d => d.toISOString().split('T')[0]);
    const maxRevenue = Math.max(...revenueData);

    return res.status(200).json({
      message: "Revenue data last 7 days fetched",
      data: { revenueData, maxRevenue, labels },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch revenue data",
      data: null,
      errorMessage: (error as Error).message,
    });
  }
};

export const getSlotParking = async (req: Request, res: Response) => {
  try {
    const kosong : number[] | null = getParkingData() || [];
    const slotParking: number | null =  kosong?.length > 0 ? kosong[0] : null;
    // const dataParking = await generateTicket(); 
    // const slotParking = dataParking.kosong;

    return res.status(200).json({ data: slotParking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get slot parking",
      data: null,
      errorMessage: (error as Error).message
    });
  }
};
