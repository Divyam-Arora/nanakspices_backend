import type { NextFunction, Request, Response } from "express";
import {
  addProductsToCategory,
  createCategory,
  getAllCategories,
  getCategoryProducts,
} from "../models/categoryModel";
import GlobalError from "../utils/GlobalError";
import { getProductWithNoCategory } from "../models/productModel";
import type { Product } from "@prisma/client";

export const addCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await createCategory(req.body);
    res.json(category);
  } catch (error) {
    next("couldn't create category");
  }
};

export const getCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productsWithNoCategory = await getProductWithNoCategory();
  const categories = await getAllCategories();
  if (productsWithNoCategory.length) {
    categories.push({
      id: "others",
      name: "Others",
      _count: {
        Product: productsWithNoCategory.length,
      },
    });
  }
  res.json(categories);
};

export const getCategoryProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let products;
  const categoryId = req.params.categoryId;
  if (categoryId.toLocaleLowerCase().startsWith("other")) {
    const prods = await getProductWithNoCategory(req.query.lastIndex as string);
    products = { Product: prods };
  } else {
    products = await getCategoryProducts(
      categoryId,
      req.query.lastIndex as string
    );
  }

  res.json(products?.Product);
};

export const addProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await addProductsToCategory(
      req.params.categoryId,
      req.body.products
    );
    res.json(category);
  } catch (error: any) {
    next(new GlobalError(error.message, 404));
  }
};
