import { Router } from "express";
import validate from "../../validation/validate";
import { categorySchema } from "../../validation/dataValidators";
import {
  addCategoryController,
  addProductsController,
} from "../../controllers/categoryController";
import { addProductController } from "../../controllers/productController";
import { getCategories } from "../../controllers/admin/categoryController";

const categoryAdminRoutes = Router();

categoryAdminRoutes.get("/", getCategories);
categoryAdminRoutes.post("/", validate(categorySchema), addCategoryController);
categoryAdminRoutes.put("/:categoryId/products", addProductsController);

export default categoryAdminRoutes;
