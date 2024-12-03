import { PrismaClient } from "@prisma/client";
import type { z } from "zod";
import type {
  productSchema,
  productTypeSchema,
  unitSchema,
} from "../validation/dataValidators";
import { createPaginator } from "prisma-extension-pagination";

const paginate = createPaginator({
  pages: {
    includePageCount: true,
    limit: 20,
  },
});
const prisma = new PrismaClient().$extends({
  model: {
    product: {
      paginate,
    },
  },
});

export const createProduct = (product: z.infer<typeof productSchema>) => {
  return prisma.product.create({
    data: {
      name: product.name,
      availability: product.availability,
      categoryId: product.categoryId,
    },
  });
};

export const getAllProducts = () => {
  return prisma.product.findMany();
};

export const getAllProductsByCategory = (
  categoryId: string | undefined | null,
  page: number
) => {
  return prisma.product
    .paginate({
      where: {
        categoryId,
      },
      orderBy: [
        { availability: "desc" },
        {
          name: "asc",
        },
      ],
      include: {
        category: true,
        ProductImage: {
          take: 1,
          orderBy: {
            position: "asc",
          },
        },
        productType: {
          where: { availability: true, stock: { gt: 0 } },
          orderBy: {
            TypeOrder: { position: "asc" },
          },
          take: 3,
          select: {
            availability: true,
            id: true,
            price: true,
            stock: true,
            unit: true,
          },
        },
        _count: {
          select: {
            productType: {
              where: {
                availability: true,
              },
            },
          },
        },
      },
    })
    .withPages({
      page,
    });
};

export const getAllProductsByCategoryAndPage = (
  categoryId: string | undefined | null,
  page: number,
  search: string | undefined,
  order: any[] = []
) => {
  if (order.length == 0) {
    order = [
      {
        availability: "desc",
      },
      {
        name: "asc",
      },
    ];
  }
  return prisma.product
    .paginate({
      where: {
        categoryId,
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: [...order, { name: "asc" }],
      select: {
        availability: true,
        category: true,
        id: true,
        name: true,
        ProductImage: {
          orderBy: {
            position: "asc",
          },
          take: 1,
        },
        productType: {
          orderBy: {
            TypeOrder: { position: "asc" },
          },
          take: 2,
          select: {
            availability: true,
            id: true,
            price: true,
            stock: true,
            unit: true,
          },
        },
      },
    })
    .withPages({
      page,
    });
};

export const getProductById = (productId: string) => {
  return prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      category: true,
      productType: {
        include: {
          unit: true,
        },
        orderBy: [{ availability: "desc" }, { TypeOrder: { position: "asc" } }],
      },
      ProductImage: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
};

export const getAllProductDetails = (productId: string) => {
  return prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      availability: true,
      name: true,
      category: true,
      description: true,
      productType: {
        select: {
          id: true,
          availability: true,
          price: true,
          stock: true,
          unit: true,
        },
        orderBy: {
          TypeOrder: { position: "asc" },
        },
      },
      ProductImage: {
        orderBy: {
          position: "asc",
        },
      },
      OrderedProducts: {
        orderBy: {
          order: {
            createdAt: "desc",
          },
        },
        take: 4,
        distinct: "orderId",
        select: {
          order: {
            select: {
              address: true,
              id: true,
              createdAt: true,
              status: true,
              paymentOn: true,
              OrderActivity: { orderBy: { createdAt: "desc" }, take: 1 },
              _count: {
                select: {
                  OrderedProducts: true,
                },
              },
              payment: true,
              price: true,
              items: true,
              products: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const createUnit = (unit: z.infer<typeof unitSchema>) => {
  return prisma.unit.create({
    data: unit,
  });
};

export const createProductType = (
  productType: z.infer<typeof productTypeSchema>,
  orderOfType: number = 1
) => {
  return prisma.productType.create({
    data: {
      productId: productType.productId,
      unitId: productType.unitId,
      price: productType.price,
      availability: productType.availability,
      stock: productType.stock,
      TypeOrder: {
        create: {
          position: orderOfType,
        },
      },
    },
    include: {
      unit: true,
    },
  });
};

export const updateProductType = (
  id: string,
  productType: z.infer<typeof productTypeSchema>
) => {
  return prisma.productType.update({
    where: {
      id,
    },
    data: {
      unitId: productType.unitId,
      price: productType.price,
      availability: productType.availability,
      stock: productType.stock,
    },
    include: {
      unit: true,
    },
  });
};

export const getProductTypeById = (id: string) => {
  return prisma.productType.findUnique({
    where: {
      id,
    },
  });
};

export const getProductWithNoCategory = (lastIndex?: string) => {
  if (lastIndex)
    return prisma.product.findMany({
      where: {
        category: null,
      },
      orderBy: [
        {
          availability: "asc",
        },
        {
          name: "asc",
        },
      ],
      take: 10,
      skip: 1,
      cursor: {
        id: lastIndex,
      },
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
            price: "asc",
          },
        },
      },
    });
  else
    return prisma.product.findMany({
      where: {
        category: null,
      },
      orderBy: [
        {
          availability: "asc",
        },
        {
          name: "asc",
        },
      ],
      take: 10,
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
            price: "asc",
          },
        },
      },
    });
};

export const getProductsByName = (
  search: string,
  lastIndex?: any,
  pageSize: number = 10
) => {
  if (lastIndex)
    return prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: [
        {
          availability: "asc",
        },
        {
          name: "asc",
        },
      ],
      take: pageSize,
      skip: 1,
      cursor: {
        id: lastIndex,
      },
      select: {
        availability: true,
        id: true,
        category: true,
        name: true,
        _count: {
          select: {
            productType: true,
          },
        },
        productType: {
          orderBy: {
            TypeOrder: { position: "asc" },
          },
          take: 2,
          select: {
            availability: true,
            id: true,
            price: true,
            stock: true,
            unit: true,
          },
        },
        ProductImage: {
          take: 1,
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  else
    return prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: [
        {
          availability: "asc",
        },
        {
          name: "asc",
        },
      ],
      take: pageSize,
      select: {
        availability: true,
        id: true,
        category: true,
        name: true,
        _count: {
          select: {
            productType: true,
          },
        },
        productType: {
          orderBy: {
            price: "asc",
          },
          take: 2,
          select: {
            availability: true,
            id: true,
            price: true,
            stock: true,
            unit: true,
          },
        },
        ProductImage: {
          take: 1,
          orderBy: {
            position: "asc",
          },
        },
      },
    });
};

export const editProductDescription = (id: string, desc: string) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      description: desc,
    },
  });
};

export const editProductInfo = (
  id: string,
  product: z.infer<typeof productSchema>
) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      name: product.name,
      availability: product.availability,
      categoryId: product.categoryId,
    },
  });
};

export const getProductTypes = (id: string) => {
  return prisma.productType.findMany({
    where: {
      productId: id,
    },
    orderBy: {
      TypeOrder: {
        position: "asc",
      },
    },
    include: {
      unit: true,
      TypeOrder: true,
    },
  });
};

export const editProductTypePosition = (orderOfTypes: string[]) => {
  const promises = orderOfTypes.map((id, i) =>
    prisma.productType.update({
      where: { id },
      data: { TypeOrder: { update: { position: i + 1 } } },
    })
  );
  return Promise.all(promises);
};

export const getProductTypeCount = (id: string) => {
  return prisma.productType.count({ where: { productId: id } });
};

export const getProductUnitBySearch = (
  value: string | undefined = undefined
) => {
  return prisma.unit.findMany({
    where: {
      OR: [{ name: { contains: value } }, { description: { contains: value } }],
    },
    take: 10,
    orderBy: [
      {
        name: "asc",
      },

      { description: "asc" },
    ],
  });
};

export const getProductImagesCount = (productId: string) => {
  return prisma.productImage.count({
    where: {
      productId,
    },
  });
};

export const addProductImages = (productId: string, productImages: any[]) => {
  return prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      ProductImage: {
        createMany: {
          data: productImages.map((image) => ({
            position: image.position,
            url: image.url,
            publicId: image.publicId,
          })),
        },
      },
    },
    select: {
      ProductImage: {
        orderBy: { position: "asc" },
      },
    },
  });
};

export const editProductImagePosition = (imagePositions: string[]) => {
  const promises = imagePositions.map((id, i) =>
    prisma.productImage.update({
      where: { id },
      data: {
        position: i + 1,
      },
    })
  );
  return Promise.all(promises);
};

export const getProductImage = (id: string) => {
  return prisma.productImage.findUnique({ where: { id } });
};

export const getProductImageIds = (productId: string) => {
  return prisma.productImage.findMany({
    where: {
      productId,
    },
    orderBy: {
      position: "asc",
    },
    select: {
      id: true,
    },
  });
};

export const deleteProductImage = (id: string) => {
  return prisma.productImage.delete({ where: { id } });
};
