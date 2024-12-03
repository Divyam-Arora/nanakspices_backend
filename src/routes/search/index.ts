import { Router } from "express";
import { getProductBySearchController } from "../../controllers/productController";

const searchRouter = Router();

searchRouter.get("/product", getProductBySearchController);

export default searchRouter;
