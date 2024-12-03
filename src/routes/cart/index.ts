import { Router } from "express";
import {
  addProductToCartController,
  clearCartController,
  deleteCartProductController,
  getCartProductsController,
  updateCartProductController,
  updateCartProductsController,
} from "../../controllers/cartController";
import validate from "../../validation/validate";
import { cartProductSchema } from "../../validation/dataValidators";
import { z } from "zod";

const cartRouter = Router();

cartRouter.post("/", validate(cartProductSchema), addProductToCartController);
cartRouter.get("/", getCartProductsController);
cartRouter.put(
  "/edit",
  validate(z.record(z.string(), z.number().min(0))),
  updateCartProductsController
);
cartRouter.put("/", validate(cartProductSchema), updateCartProductController);
cartRouter.delete(
  "/",
  validate(cartProductSchema),
  deleteCartProductController
);
cartRouter.delete("/clear", clearCartController);
export default cartRouter;
