import type { NextFunction, Request, Response } from "express";
import { getUserById } from "../models/userModel";
import { ROLE } from "@prisma/client";
import GlobalError from "../utils/GlobalError";

const validateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId as string;
  const user = await getUserById(userId);
  if (user?.role == ROLE.ADMIN) {
    next();
  } else {
    next(new GlobalError("Access Denied", 403));
  }
};

export default validateAdmin;
