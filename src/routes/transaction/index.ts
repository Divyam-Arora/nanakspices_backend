import { Router } from "express";
import { getUserTransactionsController } from "../../controllers/balanceController";

const transactionRouter = Router();

transactionRouter.get("/", getUserTransactionsController);

export default transactionRouter;
