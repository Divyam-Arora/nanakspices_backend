import type { z } from "zod";
import db from "../drizzle";
import { user } from "../drizzle/schema";
import type {
  userAddressSchema,
  userSchema,
  userSignupSchema,
} from "../validation/dataValidators";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrEditUser = (
  userData: z.infer<typeof userSignupSchema>
) => {
  return prisma.user.upsert({
    where: {
      id: userData.id || "",
    },
    create: {
      ...userData,
      firm: "Test",
      Balance: {
        create: {
          amount: 0.0,
        },
      },
    },
    update: userData,
  });
};

export const createAdmin = (userData: z.infer<typeof userSignupSchema>) => {
  return prisma.user.create({
    data: {
      ...userData,
      role: "ADMIN",
    },
  });
};

export const getAdmin = () => {
  return prisma.user.findUnique({
    where: {
      id: "admin",
    },
  });
};

export const editUser = (userData: z.infer<typeof userSchema>) => {
  return prisma.user.update({
    where: {
      id: userData.id,
    },
    data: userData,
  });
};

export const getUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      role_email: {
        email,
        role: "CUSTOMER",
      },
    },
  });
};

export const getUserByPhoneNumber = (phoneNumber: string) => {
  return prisma.user.findUnique({
    where: {
      role_phoneNumber: {
        role: "CUSTOMER",
        phoneNumber,
      },
    },
  });
};

export const getUserById = (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phoneNumber: true,
      role: true,
      Balance: true,
    },
  });
};

export const getAddressByUser = (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Address: true,
    },
  });
};

export const getUserAddressById = (userId: string, addressId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Address: {
        where: {
          id: addressId,
        },
        select: {
          city: true,
          id: true,
          landmark: true,
          line1: true,
          line2: true,
          name: true,
          phoneNumber: true,
          pincode: true,
          state: true,
        },
      },
    },
  });
};

export const createAndAddUserAddress = (
  userId: string,
  address: z.infer<typeof userAddressSchema>
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      Address: {
        upsert: {
          create: address,
          update: address,
          where: {
            id: address.id || "",
          },
        },
      },
    },
    select: {
      id: true,
      Address: true,
    },
  });
};

export const deleteUserAddress = (userId: string, addressId: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      Address: {
        delete: {
          id: addressId,
        },
      },
    },
  });
};
