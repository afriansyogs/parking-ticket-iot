import { prisma } from '../lib/prisma'
import { Request, Response } from "express";
import { Res, User } from '../types/type';
import { AuthRequest } from '../middlewares/AuthMiddleware';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export const signToken = (id: string, role: string): string => {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw new Error("JWT environment variables are not defined");
  }

  return jwt.sign({
    id,
    role 
  }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(500).json({ error: 'fields required' });
    }

    const hashedPassword : string = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const successResponse : Res<User> = {
      message: "User registered successfully",
      data: newUser
    };

    res.status(201).json(successResponse);
  } catch (error) {
    const errorResponse: Res<null> = {
      message: "Server error",
      data: null,
      errorMessage: (error as Error).message
    };
    console.error(error);
    res.status(500).json(errorResponse);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } : { username: string; password: string } = req.body;

    if (!username || !password) {
      return res.status(500).json({ error: 'fields required' });
    }

    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user.id, user.role);

    res.status(200).json({ message: "Login successful", data: { token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getUserEmail = async(req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const userEmail = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        username: true,
        email: true,
        role: true
      }
    })
    res.status(200).json({ message: "Login successful", data:  userEmail  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
}