import { PrismaClient } from "@prisma/client";
import type { z } from "zod";
import type { cartProductSchema } from "../validation/dataValidators";

const prisma = new PrismaClient();

export const addToCart = (
  userId: string,
  product: z.infer<typeof cartProductSchema>
) => {
  return prisma.cart.upsert({
    create: {
      userId: userId,
      ...product,
    },
    update: {
      quantity: {
        increment: product.quantity,
      },
    },
    where: {
      userId_productTypeId: {
        userId,
        productTypeId: product.productTypeId,
      },
    },
  });
};

export const getCart = (userId: string) => {
  return prisma.cart.findMany({
    where: {
      userId,
    },
    select: {
      quantity: true,
      productType: {
        select: {
          id: true,
          price: true,
          stock: true,
          product: {
            select: {
              id: true,
              name: true,
              ProductImage: {
                take: 1,
                orderBy: {
                  position: "asc",
                },
              },
            },
          },
          unit: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
    },
    orderBy: {
      productTypeId: "asc",
    },
  });
};

export const updateCartProduct = (
  userId: string,
  productTypeId: string,
  quantity: number
) => {
  return prisma.cart.update({
    where: {
      userId_productTypeId: {
        userId,
        productTypeId: productTypeId,
      },
    },
    data: {
      quantity: quantity,
    },
  });
};

export const deleteCartProduct = (userId: string, productTypeId: string) => {
  return prisma.cart.delete({
    where: {
      userId_productTypeId: {
        userId,
        productTypeId,
      },
    },
  });
};

export const emptyUserCart = (userId: string) => {
  return prisma.cart.deleteMany({
    where: {
      userId,
    },
  });
};
