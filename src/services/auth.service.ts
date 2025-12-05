import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

export class AuthService {
  async register(fullName: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { fullName, email, password: hashed },
    });

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    return { user, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const match = await comparePassword(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    return { user, accessToken, refreshToken };
  }

  async refresh(token: string) {
    try {
      const decoded: any = require("jsonwebtoken").verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string
      );

      const accessToken = generateAccessToken({
        id: decoded.id,
        role: decoded.role,
      });

      return { accessToken };
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }
}
