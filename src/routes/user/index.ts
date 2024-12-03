import { Router } from "express";
import {
  getUserAddresses,
  getUserController,
  addUserAddress,
  deleteUserAddressController,
  getUserAddress,
  editUserData,
} from "../../controllers/userController";
import validate from "../../validation/validate";
import {
  userAddressSchema,
  userSchema,
  userSignupSchema,
} from "../../validation/dataValidators";

const userRouter = Router();

userRouter.get("/", getUserController);
userRouter.put("/", validate(userSchema), editUserData);
userRouter.get("/address", getUserAddresses);
userRouter.get("/address/:addressId", getUserAddress);
userRouter.post("/address", validate(userAddressSchema), addUserAddress);
userRouter.delete("/address", deleteUserAddressController);

export default userRouter;
