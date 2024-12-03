import { PrismaClient } from "@prisma/client";
import { createPaginator, pagination } from "prisma-extension-pagination";

const paginate = createPaginator({
  pages: {
    includePageCount: true,
    limit: 20,
  },
});

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      paginate,
    },
    order: {
      paginate,
    },
  },
});

export const getAllCustomers = (
  page: number,
  search: string | undefined,
  order: any[]
) => {
  if (order.length == 0) {
    order = [
      {
        name: "asc",
      },
    ];
  }
  return prisma.user
    .paginate({
      where: {
        role: "CUSTOMER",
        OR: [
          { name: { startsWith: search } },
          { phoneNumber: { startsWith: search } },
          { email: { startsWith: search } },
        ],
      },
      orderBy: [...order, { name: "asc" }],
      select: {
        createdAt: true,
        email: true,
        gstNumber: true,
        firm: true,
        id: true,
        name: true,
        phoneNumber: true,
        role: true,
        Balance: {
          select: {
            amount: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
    .withPages({
      page,
    });
};

export const getCustomerDetails = (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      firm: true,
      phoneNumber: true,
      email: true,
      gstNumber: true,
      role: true,
      Address: true,
      Cart: {
        select: {
          productType: {
            select: {
              id: true,
              availability: true,
              price: true,
              product: {
                include: {
                  ProductImage: {
                    take: 1,
                    orderBy: {
                      position: "asc",
                    },
                  },
                },
              },
              stock: true,
              unit: true,
            },
          },
          quantity: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      Order: {
        take: 4,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          items: true,
          payment: true,
          _count: {
            select: {
              OrderedProducts: true,
            },
          },
          price: true,
          paymentOn: true,
          status: true,
          products: true,
          address: true,
        },
      },
      createdAt: true,
      _count: {
        select: {
          Order: true,
        },
      },
      Balance: true,
      TransactionHistory: {
        take: 6,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          amount: true,
          closing: true,
          createdAt: true,
          gatewayTransactionId: true,
          id: true,
          opening: true,
        },
      },
    },
  });
};

export const getCustomerOrders = (customerId: string, page: number) => {
  return prisma.order
    .paginate({
      where: {
        userId: customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        address: true,
        items: true,
        createdAt: true,
        payment: true,
        paymentOn: true,
        price: true,
        products: true,
        status: true,
        _count: {
          select: {
            OrderedProducts: true,
          },
        },
      },
    })
    .withPages({ page });
};
