import { Router } from "express";
import {
  getCategoriesController,
  getCategoryProductsController,
} from "../../controllers/categoryController";
import { getAllProductsByCategoryController } from "../../controllers/productController";

const categoryRouter = Router();

categoryRouter.get("/", getCategoriesController);
categoryRouter.get("/:categoryId", getAllProductsByCategoryController);

export default categoryRouter;
