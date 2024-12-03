import { Router, type Request, type Response } from "express";
import {
  productSchema,
  productTypeSchema,
  unitSchema,
} from "../../validation/dataValidators";
import validate from "../../validation/validate";
import {
  addProductController,
  addProductTypeController,
  addUnitController,
} from "../../controllers/productController";
import { addProduct } from "../../controllers/admin/productController";

const productAdminRouter = Router();

productAdminRouter.post("/", validate(productSchema), addProduct);
productAdminRouter.post("/unit", validate(unitSchema), addUnitController);
productAdminRouter.post(
  "/type",
  validate(productTypeSchema),
  addProductTypeController
);

export default productAdminRouter;
