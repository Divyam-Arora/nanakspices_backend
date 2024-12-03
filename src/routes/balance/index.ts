import { Router } from "express";
import {
  editUserBalanceController,
  getUserBalanceController,
} from "../../controllers/balanceController";

const balanceRouter = Router();

balanceRouter.get("/", getUserBalanceController);
balanceRouter.post("/", editUserBalanceController);

export default balanceRouter;
