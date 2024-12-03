import type { NextFunction, Request, Response } from "express";
import {
  createProduct,
  createProductType,
  createUnit,
  getAllProducts,
  getAllProductsByCategory,
  getProductById,
  getProductsByName,
  getProductTypeCount,
} from "../models/productModel";
import GlobalError from "../utils/GlobalError";

export const addProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await createProduct(req.body);
  res.json(product);
};

export const addUnitController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await createUnit(req.body)
    .then((data) => res.json(data))
    .catch((error) => {
      next(new GlobalError("Coundn't create unit"));
    });
};

export const addProductTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let unitId = req.body.unitId;
    if (req.body.createUnit) {
      const unit = await createUnit({
        name: req.body.unitName,
        description: req.body.unitDescription,
      });
      unitId = unit.id;
    }
    const count = await getProductTypeCount(req.params.productId);
    const productType = await createProductType(
      { ...req.body, unitId },
      count + 1
    );
    res.json(productType);
  } catch (error) {
    next(new GlobalError("Couldn't create type"));
  }
};

export const getAllProductsController = async (req: Request, res: Response) => {
  const products = await getAllProducts();
  res.json({ products });
};

export const getAllProductsByCategoryController = async (
  req: Request,
  res: Response
) => {
  let categoryId: string | undefined | null;
  if (req.params.categoryId) {
    if (req.params.categoryId.toLocaleLowerCase().startsWith("other"))
      categoryId = null;
    else if (req.params.categoryId == "all") categoryId = undefined;
    else categoryId = req.params.categoryId;
  } else categoryId = undefined;
  const products = await getAllProductsByCategory(
    categoryId,
    req.query.page ? +req.query.page : 1
  );
  console.log(products);
  res.json({ list: products[0], meta: products[1] });
};

export const getProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await getProductById(req.params.productId);
    res.json(product);
  } catch (error) {
    next(new GlobalError("product doesn't exist or was deleted", 404));
  }
};

export const getProductBySearchController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getProductsByName(
      req.query.name as string,
      req.query.lastIndex
    );
    res.json(products);
  } catch (error) {
    next(error);
  }
};
