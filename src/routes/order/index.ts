import { Router } from "express";
import {
  cancelOrderController,
  getAllOrders,
  getOrderDetails,
  getUserOrderDetailsController,
  getUserOrdersControllers,
  orderProductsController,
  updateOrder,
} from "../../controllers/orderController";
import validate from "../../validation/validate";
import { orderSchema } from "../../validation/dataValidators";

const orderRouter = Router();

orderRouter.post("/", validate(orderSchema), orderProductsController);
orderRouter.get("/", getUserOrdersControllers);
orderRouter.get("/:orderId", getUserOrderDetailsController);
orderRouter.post("/:orderId/cancel", cancelOrderController);
orderRouter.post("/:orderId");

const orderAdminRouter = Router();

orderAdminRouter.get("/", getAllOrders);
orderAdminRouter.get("/:orderId", getOrderDetails);
orderAdminRouter.put("/:orderId/update", updateOrder);

export default { orderRouter, orderAdminRouter };
