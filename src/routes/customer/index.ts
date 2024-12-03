import { Router } from "express";
import {
  getAllCustomersController,
  getCustomerDetailsController,
  getCustomerOrdersController,
} from "../../controllers/admin/customerController";

const customerRouter = Router();

customerRouter.get("/", getAllCustomersController);
customerRouter.get("/:customerId", getCustomerDetailsController);
customerRouter.get("/:customerId/order", getCustomerOrdersController);

export default customerRouter;
