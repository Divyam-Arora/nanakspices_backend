import { Router } from "express";
import validate from "../../validation/validate";
import { unitSchema } from "../../validation/dataValidators";
import { addUnitController } from "../../controllers/productController";
import { getUnitBySearchController } from "../../controllers/admin/productController";

const unitAdminRouter = Router();

unitAdminRouter.post("/", validate(unitSchema), addUnitController);
unitAdminRouter.get("/", getUnitBySearchController);

export default unitAdminRouter;
