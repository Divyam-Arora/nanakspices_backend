import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { getUserById } from "../models/userModel";

const secret = new TextEncoder().encode(Bun.env.TOKEN_SECRET);

const tokenValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders: string | undefined = req.headers["authorization"];
  const token: string | undefined = authHeaders && authHeaders.split(" ")[1];

  try {
    const cred = await jwtVerify(token as string, secret);
    const userId = cred.payload.userId as string;
    const user = await getUserById(userId);
    req.userId = userId;
    next();
  } catch (err: any) {
    // next(err);
    console.log(err);
    next("Invalid token");
  }
};

export default tokenValidation;
