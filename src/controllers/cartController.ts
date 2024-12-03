import type { NextFunction, Request, Response } from "express";
import {
  addToCart,
  deleteCartProduct,
  emptyUserCart,
  getCart,
  updateCartProduct,
} from "../models/cartModel";
import { getProductTypeById } from "../models/productModel";
import type { z } from "zod";
import type { cartProductSchema } from "../validation/dataValidators";
import GlobalError from "../utils/GlobalError";

export const addProductToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productType = await getProductTypeById(
      (req.body as z.infer<typeof cartProductSchema>).productTypeId
    );
    if (
      productType &&
      productType?.stock <
        (req.body as z.infer<typeof cartProductSchema>).quantity
    )
      throw new GlobalError("Stocks are limited!", 404);
    const cart = await addToCart(req.userId as string, req.body);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const getCartProductsController = async (
  req: Request,
  res: Response
) => {
  const products = await getCart(req.userId as string);
  res.json({ products });
};

export const updateCartProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await updateCart(
      req.userId as string,
      req.body.productTypeId,
      req.body.quantity
    );
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const deleteCartProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await deleteCartProduct(req.userId as string, req.body);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCartProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    Object.keys(req.body as {}).forEach(async (key) => {
      await updateCart(req.userId as string, key, req.body[key]);
    });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const clearCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await emptyUserCart(req.userId as string);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

async function updateCart(
  userId: string,
  productTypeId: string,
  quantity: number
) {
  const productType = await getProductTypeById(productTypeId);
  if (quantity <= 0) {
    return await deleteCartProduct(userId as string, productTypeId);
  }
  if (productType && productType?.stock < quantity)
    throw new GlobalError("Stocks are limited!", 404);
  return await updateCartProduct(userId as string, productTypeId, quantity);
}
