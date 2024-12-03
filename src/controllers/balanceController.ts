import type { NextFunction, Request, Response } from "express";
import {
  addUserTransaction,
  editUserBalance,
  getBalanceDetailsByUserId,
  getUserTransactions,
} from "../models/balanceModel";

export const getUserBalanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const balance = await getBalanceDetailsByUserId(req.userId as string);
    res.json(balance);
  } catch (err) {
    next(err);
  }
};

export const editUserBalanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // verify Transaction
    if (1) {
      const balance = await editUserBalance(
        req.userId as string,
        "remove",
        req.body.amount
      );
      const transaction = await addUserTransaction(
        req.userId as string,
        req.body.amount,
        +balance.amount,
        "DUMMY_ID"
      );
      res.json({
        balance,
        transaction,
      });
    } else {
      throw new Error("Invalid Transaction");
    }
  } catch (err) {
    next(err);
  }
};

export const getUserTransactionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await getUserTransactions(
      req.userId as string,
      +(req.query.page || 1)
    );
    res.json({
      list: transactions[0],
      meta: transactions[1],
    });
  } catch (err) {
    next(err);
  }
};
