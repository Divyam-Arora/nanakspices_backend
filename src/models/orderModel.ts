import { ORDERSTATUS, PAYMENTSTATUS, PrismaClient } from "@prisma/client";
import { createPaginator, pagination } from "prisma-extension-pagination";

const paginate = createPaginator({
  pages: {
    limit: 20,
    includePageCount: true,
  },
});
const prisma = new PrismaClient().$extends({
  model: {
    order: {
      paginate,
    },
  },
});

export type orderedProduct = {
  //   orderId: string;
  productId: string;
  unitId: string;
  quantity: number;
  price: number;
};

export const createOrder = (
  userId: string,
  addressId: string,
  price: number,
  products: orderedProduct[]
) => {
  return prisma.$transaction([
    prisma.order.create({
      data: {
        userId,
        addressId,
        price,
        OrderedProducts: {
          createMany: {
            data: products,
          },
        },
        OrderActivity: {
          create: {},
        },
        products: products.length,
        items: products.reduce((acc, p) => acc + p.quantity, 0),
      },
    }),
    prisma.balance.update({
      where: {
        userId,
      },
      data: {
        amount: { increment: price },
      },
    }),
  ]);
};

export const getAllUserOrdersByCursor = (userId: string, lastId: string) => {
  return prisma.order.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      price: true,
      payment: true,
      createdAt: true,
      items: true,
      products: true,
      OrderActivity: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      _count: {
        select: {
          OrderedProducts: true,
        },
      },
      OrderedProducts: {
        select: {
          product: {
            select: {
              name: true,
              id: true,
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
              name: true,
              id: true,
              description: true,
            },
          },
        },
        orderBy: {
          quantity: "desc",
        },
        take: 2,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    cursor: {
      id: lastId,
    },
    take: 20,
    skip: 1,
  });
};

export const getAllUserOrdersByPage = (
  userId: string,
  page: number,
  size: number = 10
) => {
  return prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: page * size,
    take: size,
    select: {
      id: true,
      price: true,
      payment: true,
      createdAt: true,
      items: true,
      products: true,
      OrderActivity: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      _count: {
        select: {
          OrderedProducts: true,
        },
      },
      OrderedProducts: {
        select: {
          product: {
            select: {
              name: true,
              id: true,
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
              name: true,
              id: true,
              description: true,
            },
          },
        },
        orderBy: {
          quantity: "desc",
        },
        take: 2,
      },
    },
  });
};

export const getAllOrdersByPage = (
  page: number,
  size: number = 10,
  status: ORDERSTATUS[] | undefined,
  payment: PAYMENTSTATUS[] | undefined,
  order: any[] = [],
  search: string = ""
) => {
  if (order.length == 0) {
    order = [
      {
        createdAt: "desc",
      },
    ];
  }
  return prisma.order
    .paginate({
      where: {
        status: {
          in: status,
        },
        payment: {
          in: payment,
        },
        user: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      select: {
        address: true,
        id: true,
        createdAt: true,
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
      orderBy: [
        ...order,
        {
          createdAt: "desc",
        },
      ],
    })
    .withPages({ page });
  // return prisma.order.findMany({
  //   take: size,
  //   skip: page * size,
  //   orderBy: [
  //     ...order,
  //     {
  //       createdAt: "desc",
  //     },
  //   ],
  //   where: {
  //     status: {
  //       in: status,
  //     },
  //     payment: {
  //       in: payment,
  //     },
  //     user: {
  //       name: {
  //         contains: search,
  //         mode: "insensitive",
  //       },
  //     },
  //   },
  //   select: {
  //     address: true,
  //     id: true,
  //     createdAt: true,
  //     OrderActivity: { orderBy: { createdAt: "desc" }, take: 1 },
  //     _count: {
  //       select: {
  //         OrderedProducts: true,
  //       },
  //     },
  //     payment: true,
  //     price: true,
  //     items: true,
  //     products: true,
  //     user: {
  //       select: {
  //         id: true,
  //         email: true,
  //         name: true,
  //         phoneNumber: true,
  //       },
  //     },
  //   },
  // });
};

export const getAllOrdersByCursor = (
  lastIndex: string,
  status: ORDERSTATUS[] = [],
  payment: PAYMENTSTATUS[] = [],
  order: any[] = [],
  search: string = ""
) => {
  if (status.length == 0) {
    status = Object.values(ORDERSTATUS);
  }
  if (payment.length == 0) {
    payment = Object.values(PAYMENTSTATUS);
  }
  if (order.length == 0) {
    order = [
      {
        createdAt: "desc",
      },
    ];
  }

  // const orders = prisma.order
  //   .paginate({
  //     where: {
  //       status: {
  //         in: status,
  //       },
  //       payment: {
  //         in: payment,
  //       },
  //     },
  //     select: {
  //       address: true,
  //       id: true,
  //       createdAt: true,
  //       OrderActivity: { orderBy: { createdAt: "desc" }, take: 1 },
  //       _count: {
  //         select: {
  //           OrderedProducts: true,
  //         },
  //       },
  //       payment: true,
  //       price: true,
  //       items: true,
  //       products: true,
  //       user: {
  //         select: {
  //           id: true,
  //           email: true,
  //           name: true,
  //           phoneNumber: true,
  //         },
  //       },
  //     },
  //     orderBy: order,
  //   })
  //   .withCursor({
  //     limit: 10,
  //   });
  return prisma.order.findMany({
    take: 10,
    cursor: {
      id: lastIndex,
    },
    skip: 1,
    orderBy: [
      ...order,
      {
        createdAt: "desc",
      },
    ],
    where: {
      status: {
        in: status,
      },
      payment: {
        in: payment,
      },
      user: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
    select: {
      address: true,
      id: true,
      createdAt: true,
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
  });
};

export const getAllOrderCount = () => {
  return prisma.order.count();
};
export const getUserOrderById = (orderId: string) => {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      _count: {
        select: {
          OrderedProducts: true,
        },
      },
      address: true,
      OrderActivity: {
        orderBy: {
          createdAt: "desc",
        },
      },
      OrderedProducts: {
        select: {
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
          unit: true,
          quantity: true,
          price: true,
        },
        orderBy: {
          quantity: "desc",
        },
      },
    },
  });
};

export const getOrderById = (orderId: string) => {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      address: true,
      createdAt: true,
      id: true,
      items: true,
      OrderActivity: {
        orderBy: {
          createdAt: "desc",
        },
      },
      OrderedProducts: {
        orderBy: {
          quantity: "desc",
        },
        select: {
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
          quantity: true,
          unit: true,
        },
      },
      payment: true,
      paymentOn: true,
      price: true,
      products: true,
      status: true,
      user: {
        select: {
          email: true,
          gstNumber: true,
          id: true,
          name: true,
          phoneNumber: true,
          role: true,
        },
      },
    },
  });
};

export const cancelOrder = (userId: string, orderId: string, price: number) => {
  return prisma.$transaction([
    prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        OrderActivity: {
          create: {
            status: "CANCELLED",
          },
        },
        status: "CANCELLED",
      },
    }),
    prisma.balance.update({
      where: {
        userId,
      },
      data: {
        amount: {
          decrement: price,
        },
      },
    }),
  ]);
};

export const updateOrderStatus = (orderId: string, status: ORDERSTATUS) => {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
      OrderActivity: {
        upsert: {
          create: {
            status,
          },
          update: {
            createdAt: new Date(),
          },
          where: {
            orderId_status: {
              orderId,
              status,
            },
          },
        },
      },
    },
  });
};

export const updatePaymentStatus = (
  orderId: string,
  payment: PAYMENTSTATUS
) => {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      payment,
      paymentOn: payment == "RECEIVED" ? new Date() : null,
    },
  });
};
