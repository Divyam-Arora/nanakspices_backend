import type { NextFunction, Request, Response } from "express";
import { getAllCategories } from "../../models/categoryModel";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categories = await getAllCategories();
  res.json(categories);
};
