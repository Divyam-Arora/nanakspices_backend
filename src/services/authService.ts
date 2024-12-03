import {
  createOrEditUser,
  getUserByEmail,
  getUserByPhoneNumber,
} from "../models/userModel";
import {
  userLoginSchema,
  userSignupSchema,
} from "../validation/dataValidators";
import type { z } from "zod";

// const type = userSignupSchema.type;

// const hashPassword = (password: string) => {
//   return Bun.password.hashSync(password, {
//     algorithm: "bcrypt",
//     cost: 4,
//   });
// };
export const signup = (userData: z.infer<typeof userSignupSchema>) => {
  userData.password = Bun.password.hashSync(userData.password, {
    algorithm: "bcrypt",
    cost: 4,
  });
  return createOrEditUser(userData);
};

export const login = async (userData: z.infer<typeof userLoginSchema>) => {
  const user = await getUserByPhoneNumber(userData.phoneNumber);
  if (!user) throw new Error("Phone Number does not exists");

  if (!Bun.password.verifySync(userData.password, user.password, "bcrypt"))
    throw new Error("Password is incorrect");

  return user;
};
