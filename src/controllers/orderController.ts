import type { NextFunction, Request, Response } from "express";
import { getUserAddressById } from "../models/userModel";
import GlobalError from "../utils/GlobalError";
import { emptyUserCart, getCart } from "../models/cartModel";
import {
  cancelOrder,
  createOrder,
  getAllOrderCount,
  getAllOrdersByCursor,
  getAllOrdersByPage,
  getAllUserOrdersByCursor,
  getAllUserOrdersByPage,
  getOrderById,
  getUserOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  type orderedProduct,
} from "../models/orderModel";

export const orderProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userAddress = await getUserAddressById(
      req.userId as string,
      req.body.addressId
    );

    const cartProducts = await getCart(req.userId as string);
    if (
      cartProducts.length <= 0 ||
      cartProducts.some(
        (product) => product.productType.stock < product.quantity
      )
    )
      throw new GlobalError("Something wrong with your cart", 404);

    let price = 0;
    const orderedProducts: orderedProduct[] = cartProducts.map((product) => {
      price += product.productType.price * product.quantity;
      return {
        price: product.productType.price,
        productId: product.productType.product.id,
        unitId: product.productType.unit.id,
        quantity: product.quantity,
      };
    });

    const order = await createOrder(
      req.userId as string,
      userAddress?.Address?.[0].id as string,
      price,
      orderedProducts
    );

    await emptyUserCart(req.userId as string);

    res.json(order[0]);
  } catch (error) {
    next(error);
  }
};

export const getUserOrdersControllers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.query.lastIndex) {
    const orders = await getAllUserOrdersByCursor(
      req.userId as string,
      req.query.lastIndex as string
    );
    res.json(orders);
  } else {
    const orders = await getAllUserOrdersByPage(req.userId as string, 0);
    res.json(orders);
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  const orderBy = {
    Amount: "price",
    Date: "createdAt",
    Products: "items",
    Quantity: "items",
    Name: "id",
    1: "asc",
    [-1]: "desc",
  };
  const filterAndOrder = JSON.parse(req.query.filter as string);
  filterAndOrder.sort = filterAndOrder.sort.map((s: any) => {
    if (s.value == "Name") {
      return {
        user: {
          name: orderBy[s.order as keyof typeof orderBy],
        },
      };
    }

    return {
      [orderBy[s.value as keyof typeof orderBy]]:
        orderBy[s.order as keyof typeof orderBy],
    };
  });
  console.log(filterAndOrder);

  const [orders, meta] = await getAllOrdersByPage(
    req.query.page ? +(req.query.page as string) : 1,
    20,
    filterAndOrder.filter.status,
    filterAndOrder.filter.payment,
    filterAndOrder.sort,
    req.query.search as string
  );
  res.json({ meta, list: orders });
};

export const getUserOrderDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await getUserOrderById(req.params.orderId);
    if (!order || order.userId !== req.userId)
      throw new GlobalError("Access Denied", 403);

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await getOrderById(req.params.orderId);
    if (!order) throw new GlobalError("Not Found", 404);

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const cancelOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await getUserOrderById(req.params.orderId);
    if (
      !order ||
      order.userId !== req.userId ||
      order?.OrderActivity.find((act) => act.status == "CANCELLED")
    )
      throw Error;

    await cancelOrder(req.userId, order.id, order.price);
    res.json({
      message: "Order cancelled",
    });
  } catch (error) {
    next(new GlobalError("Not Allowed", 400));
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body.status &&
      (await updateOrderStatus(req.params.orderId, req.body.status));
    req.body.payment &&
      (await updatePaymentStatus(req.params.orderId, req.body.payment));
    const order = await getOrderById(req.params.orderId);
    res.json(order);
  } catch (err) {
    next(err);
  }
};
