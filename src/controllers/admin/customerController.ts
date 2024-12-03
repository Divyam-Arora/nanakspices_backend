import type { NextFunction, Request, Response } from "express";
import {
  getAllCustomers,
  getCustomerDetails,
  getCustomerOrders,
} from "../../models/customerModel";

export const getAllCustomersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filterAndSort = JSON.parse(req.query.filter as string);
    const sort = filterAndSort.sort.map((s: any) => ({
      [s.value.toLowerCase()]: s.order == 1 ? "asc" : "desc",
    }));
    const [customers, meta] = await getAllCustomers(
      isNaN(+(req.query.page as string)) ? 1 : +(req.query.page as string),
      req.query.search == undefined ? undefined : (req.query.search as string),
      sort
    );
    res.json({
      list: customers,
      meta,
    });
  } catch (err) {
    next(err);
  }
};

export const getCustomerDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = await getCustomerDetails(req.params.customerId);
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

export const getCustomerOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await getCustomerOrders(
      req.params.customerId,
      +(req.query.page || 1)
    );
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
