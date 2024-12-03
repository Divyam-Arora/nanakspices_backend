import { PrismaClient } from "@prisma/client";
import { createPaginator } from "prisma-extension-pagination";

const paginate = createPaginator({
  pages: {
    includePageCount: true,
    limit: 20,
  },
});
const prisma = new PrismaClient().$extends({
  model: { transactionHistory: { paginate } },
});

export const getBalanceDetailsByUserId = (userId: string) => {
  return prisma.balance.findUnique({
    where: {
      userId,
    },
  });
};

export const editUserBalance = (
  userId: string,
  mode: "add" | "remove",
  amount: number
) => {
  return prisma.balance.update({
    where: {
      userId,
    },
    data: {
      amount: mode == "add" ? { increment: amount } : { decrement: amount },
    },
  });
};

export const addUserTransaction = (
  userId: string,
  amount: number,
  closing: number,
  gtId: string
) => {
  return prisma.transactionHistory.create({
    data: {
      amount,
      closing,
      gatewayTransactionId: gtId,
      opening: Math.abs(amount + closing),
      userId,
    },
  });
};

export const getUserTransactions = (userId: string, page: number = 1) => {
  return prisma.transactionHistory
    .paginate({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    })
    .withPages({
      page,
    });
};
