import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

const validate =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error);
      res.status(404).json(result.error);
    } else next();
  };

export default validate;
