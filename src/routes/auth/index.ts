import { Router } from "express";
import validate from "../../validation/validate";
import {
  userLoginSchema,
  userSignupSchema,
} from "../../validation/dataValidators";
import {
  adminLoginController,
  loginController,
  signupController,
} from "../../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", validate(userSignupSchema), signupController);
authRouter.post("/login", validate(userLoginSchema), loginController);
authRouter.post("/admin/login", adminLoginController);
authRouter.get("/refresh");

export default authRouter;
