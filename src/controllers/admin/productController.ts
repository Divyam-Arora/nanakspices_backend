import type { NextFunction, Request, Response } from "express";
import GlobalError from "../../utils/GlobalError";
import {
  addProductImages,
  createProduct,
  createUnit,
  deleteProductImage,
  editProductDescription,
  editProductImagePosition,
  editProductInfo,
  editProductTypePosition,
  getAllProductDetails,
  getAllProductsByCategoryAndPage,
  getProductImage,
  getProductImageIds,
  getProductImagesCount,
  getProductTypes,
  getProductUnitBySearch,
  updateProductType,
} from "../../models/productModel";
import { createCategory } from "../../models/categoryModel";
import { v2 as cloudinary } from "cloudinary";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let categoryId: any = req.query.category;
  if (categoryId == "" || categoryId == "all" || categoryId == undefined)
    categoryId = undefined;
  else if (categoryId == "null" || categoryId == "others") categoryId = null;
  else categoryId = req.query.category as string;
  console.log(categoryId);

  const filterAndSort = JSON.parse(req.query.filter as string);
  const sort = filterAndSort.sort.map((s: any) => ({
    [s.value.toLowerCase()]: s.order == 1 ? "asc" : "desc",
  }));
  try {
    const [products, meta] = await getAllProductsByCategoryAndPage(
      categoryId,
      +(req.query.page as string),
      req.query.search == undefined ? undefined : (req.query.search as string),
      sort
    );
    res.json({
      list: products,
      meta,
    });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let categoryId = req.body.categoryId;
    if (req.body.createCategory) {
      const category = await createCategory({ name: req.body.categoryName });
      console.log(category);
      categoryId = category.id;
    }
    const product = await createProduct({ ...req.body, categoryId });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await getAllProductDetails(req.params.productId);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProductDescription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await editProductDescription(
      req.params.productId,
      req.body.description
    );
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProductInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let categoryId = req.body.categoryId;
    if (req.body.createCategory) {
      const category = await createCategory({ name: req.body.categoryName });
      console.log(category);
      categoryId = category.id;
    }
    console.log(req.body);
    const product = await editProductInfo(req.params.productId, {
      ...req.body,
      categoryId: categoryId || null,
    });
    res.json(product);
    res.json({});
  } catch (err) {
    next(err);
  }
};

export const getProductTypesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const types = await getProductTypes(req.params.productId);
    res.json(types);
  } catch (err) {
    next(err);
  }
};

export const editProductTypeController = async (
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
    const type = await updateProductType(req.params.productTypeId, {
      ...req.body,
      unitId,
    });
    res.json(type);
  } catch (err) {
    next(err);
  }
};

export const getUnitBySearchController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("a", req.query.search.length, "a");
    const units = await getProductUnitBySearch(req.query.search as string);
    res.json(units);
  } catch (err) {
    next(err);
  }
};

export const editProductTypePositionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const types = await editProductTypePosition(req.body.position);
    res.json(types);
  } catch (err) {
    next(err);
  }
};

export const addProductImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await getProductImagesCount(req.params.productId);
    const images = req.body.images.map((image: any, i: number) => ({
      ...image,
      position: count + 1 + i,
    }));
    const productImages = await addProductImages(req.params.productId, images);
    res.json(productImages);
  } catch (err) {
    next(err);
  }
};

export const editProductImagePositionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const images = await editProductImagePosition(req.body.position);
    res.json(images);
  } catch (err) {
    next(err);
  }
};

export const removeProductImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.params.imageId);
    const image = await getProductImage(req.params.imageId);
    console.log(image?.url);
    await cloudinary.uploader.destroy(image?.publicId as string);
    const imageIds = await getProductImageIds(req.params.productId);
    console.log(imageIds);
    const images = await editProductImagePosition(
      imageIds
        .filter((image) => image.id != req.params.imageId)
        .map((image) => image.id)
    );
    await deleteProductImage(req.params.imageId);
    console.log(images);
    res.json({ images });
  } catch (err) {
    next(err);
  }
};
