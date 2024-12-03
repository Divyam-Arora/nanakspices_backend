import { Router } from "express";
import {
  addProductController,
  addProductTypeController,
  addUnitController,
  getAllProductsController,
  getProductController,
} from "../../controllers/productController";
import validate from "../../validation/validate";
import {
  productSchema,
  productTypeSchema,
  unitSchema,
} from "../../validation/dataValidators";
import {
  addProduct,
  addProductImagesController,
  editProductImagePositionController,
  editProductTypeController,
  editProductTypePositionController,
  getAllProducts,
  getProductDetails,
  getProductTypesController,
  removeProductImageController,
  updateProductDescription,
  updateProductInfo,
} from "../../controllers/admin/productController";

const productRouter = Router();

productRouter.get("/", getAllProductsController);
productRouter.get("/:productId", getProductController);

const productAdminRouter = Router();

productAdminRouter.post("/", validate(productSchema), addProduct);
productAdminRouter.post("/unit", validate(unitSchema), addUnitController);
productAdminRouter.post(
  "/type",
  validate(productTypeSchema),
  addProductTypeController
);
productAdminRouter.get("/", getAllProducts);
productAdminRouter.get("/:productId", getProductDetails);
productAdminRouter.put(
  "/:productId/info",
  validate(productSchema),
  updateProductInfo
);
productAdminRouter.put("/:productId/description", updateProductDescription);
productAdminRouter.get("/:productId/type", getProductTypesController);
productAdminRouter.post(
  "/:productId/type",
  validate(productTypeSchema),
  addProductTypeController
);
productAdminRouter.put(
  "/:productId/type/position",
  editProductTypePositionController
);
productAdminRouter.put(
  "/:productId/type/:productTypeId",
  validate(productTypeSchema),
  editProductTypeController
);
productAdminRouter.post("/:productId/image", addProductImagesController);
productAdminRouter.put("/:productId/image", editProductImagePositionController);
productAdminRouter.delete(
  "/:productId/image/:imageId",
  removeProductImageController
);

export default { productRouter, productAdminRouter };
