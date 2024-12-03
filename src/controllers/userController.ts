import type { NextFunction, Request, Response } from "express";
import {
  createAndAddUserAddress,
  deleteUserAddress,
  getUserAddressById,
  getAddressByUser,
  getUserByEmail,
  getUserById,
  createOrEditUser,
  getUserByPhoneNumber,
  editUser,
} from "../models/userModel";
import type { z } from "zod";
import { PrismaClient, type Address } from "@prisma/client";
import GlobalError from "../utils/GlobalError";

const prisma = new PrismaClient();

export const getUserController = async (req: Request, res: Response) => {
  res.json(await getUserById(req.userId as string));
};

export const getUserAddresses = async (req: Request, res: Response) => {
  const userObj = await getAddressByUser(req.userId!);
  const addresses: Address[] | undefined = userObj?.Address;
  res.json(addresses);
};

export const getUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userAddress = await getUserAddressById(
      req.userId as string,
      req.params.addressId
    );
    res.json(userAddress?.Address[0]);
  } catch (error) {
    console.log(error);
    next(new GlobalError("Couldn't get Address", 404));
  }
};

export const addUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newAddress = await createAndAddUserAddress(
      req.userId as string,
      req.body
    );
    res.status(201).json(newAddress);
  } catch (error) {
    next(error);
  }
};

export const deleteUserAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteUserAddress(req.userId as string, req.body.addressId);
    return res.status(200).send();
  } catch (error) {
    next(new GlobalError("Couldn't delete address", 404));
  }
};

export const editUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = await getUserByEmail(req.body.email);
    if (user && user.id != req.body.id)
      throw new GlobalError("Email already exists");
    user = await getUserByPhoneNumber(req.body.phoneNumber);
    if (user && user.id != req.body.id)
      throw new GlobalError("Phone Number exists");
    user = await editUser(req.body);
  } catch (err) {
    next(err);
  }
};
