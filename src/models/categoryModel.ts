import { PrismaClient } from "@prisma/client";
import type { z } from "zod";
import type { categorySchema } from "../validation/dataValidators";

const prisma = new PrismaClient();

export const createCategory = (category: z.infer<typeof categorySchema>) => {
  return prisma.category.create({
    data: category,
  });
};

export const getAllCategories = () => {
  return prisma.category.findMany({
    include: {
      _count: {
        select: {
          Product: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const addProductsToCategory = (
  categoryId: string,
  productIds: string[]
) => {
  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      Product: {
        connect: productIds.map((id) => ({ id })),
      },
    },
    include: {
      Product: true,
    },
  });
};

export const getCategoryProducts = (
  categoryId: string,
  lastIndex?: string,
  pageSize: number = 10
) => {
  if (lastIndex) {
    return prisma.category.findUnique({
      where: {
        id: categoryId == "all" ? undefined : categoryId,
      },
      select: {
        Product: {
          take: pageSize,
          cursor: {
            id: lastIndex,
          },
          skip: 1,
          orderBy: [
            { availability: "asc" },
            {
              name: "asc",
            },
          ],
          select: {
            availability: true,
            id: true,
            name: true,
            _count: {
              select: { productType: true },
            },
            productType: {
              select: {
                id: true,
                price: true,
                availability: true,
                stock: true,
                unit: true,
              },
              take: 2,
              orderBy: {
                TypeOrder: { position: "asc" },
              },
            },
            ProductImage: {
              orderBy: { position: "asc" },
              select: { id: true, url: true, publicId: true },
              take: 1,
            },
          },
        },
      },
    });
  } else
    return prisma.category.findUnique({
      where: {
        id: categoryId == "all" ? undefined : categoryId,
      },
      select: {
        Product: {
          take: 10,
          orderBy: [
            { availability: "asc" },
            {
              name: "asc",
            },
          ],
          select: {
            availability: true,
            id: true,
            name: true,
            _count: {
              select: { productType: true },
            },
            productType: {
              select: {
                id: true,
                price: true,
                availability: true,
                stock: true,
                unit: true,
              },
              take: 2,
              orderBy: {
                TypeOrder: { position: "asc" },
              },
            },
            ProductImage: {
              orderBy: { position: "asc" },
              select: { id: true, url: true, publicId: true },
              take: 1,
            },
          },
        },
      },
    });
};

export const removeProductsfromCategory = (
  categoryId: string,
  productIds: string[]
) => {
  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      Product: {
        disconnect: productIds.map((id) => ({ id })),
      },
    },
    include: {
      Product: true,
    },
  });
};
