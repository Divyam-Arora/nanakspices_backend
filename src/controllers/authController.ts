import type { NextFunction, Request, Response } from "express";
import { login, signup } from "../services/authService";
import { EncryptJWT, SignJWT, base64url } from "jose";
import * as jose from "jose";
import { env } from "bun";
import type { Prisma } from "@prisma/client";
import GlobalError from "../utils/GlobalError";
import {
  getAdmin,
  getUserByEmail,
  getUserById,
  getUserByPhoneNumber,
} from "../models/userModel";
import e from "express";

const createToken = (payload: any) => {
  const secret = new TextEncoder().encode(env.TOKEN_SECRET as string);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secret);
};

export const signupController = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let user = await getUserByEmail(req.body.email);
    if (user && user.id != req.body.id)
      throw new GlobalError("Email already exists");
    user = await getUserByPhoneNumber(req.body.phoneNumber);
    if (user && user.id != req.body.id)
      throw new GlobalError("Phone Number already exists");

    user = await signup(req.body);
    res.status(201);
    const token = await createToken({ userId: user.id });
    res.json({
      message: "user created",
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await login(req.body);
    createToken({ userId: user.id }).then((token) => {
      res.json({
        token,
      });
    });
  } catch (err: any) {
    // console.log(err);
    next(new GlobalError(err?.message as string, 401));
  }
};

export const adminLoginController = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // const user = await login(req.body);
    const admin = await getAdmin();

    if (
      admin &&
      Bun.password.verifySync(
        req.body.password as string,
        admin.password,
        "bcrypt"
      )
    ) {
      createToken({ userId: admin.id }).then((token) => {
        res.json({
          token,
        });
      });
    } else throw new GlobalError("You are unauthorised", 403);
  } catch (err) {
    next(err);
  }
};
