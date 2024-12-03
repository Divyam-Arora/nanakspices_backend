import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import cartRouter from "./routes/cart";
import orderRouters from "./routes/order";
import productRouters from "./routes/product";
import tokenValidation from "./validation/tokenValidation";
// import productAdminRouter from "./routes/product/adminRoutes";
import type GlobalError from "./utils/GlobalError";
import validateAdmin from "./validation/adminValidation";
import categoryAdminRoutes from "./routes/category/admin";
import categoryRouter from "./routes/category";
import unitAdminRouter from "./routes/units/adminRoutes";
import searchRouter from "./routes/search";
import customerRouter from "./routes/customer";
import balanceRouter from "./routes/balance";
import transactionRouter from "./routes/transaction";
import { initialize } from "./utils/initialize";

const app = express();
const privateAPIs = express();
const publicAPIs = express();
const adminAPIs = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../static"));

publicAPIs.use("/", authRouter);
publicAPIs.use("/product", productRouters.productRouter);
publicAPIs.use("/search", searchRouter);
publicAPIs.use("/category", categoryRouter);
app.use("/api/public", publicAPIs);

privateAPIs.use("/user", userRouter);
privateAPIs.use("/cart", cartRouter);
privateAPIs.use("/order", orderRouters.orderRouter);
privateAPIs.use("/balance", balanceRouter);
privateAPIs.use("/transaction", transactionRouter);
app.use("/api", tokenValidation, privateAPIs);

adminAPIs.use("/product", productRouters.productAdminRouter);
adminAPIs.use("/category", categoryAdminRoutes);
adminAPIs.use("/unit", unitAdminRouter);
adminAPIs.use("/order", orderRouters.orderAdminRouter);
adminAPIs.use("/customer", customerRouter);
app.use("/api/admin", validateAdmin, adminAPIs);

app.use("*", (req, res) => {
  res.status(404);
  res.json({
    error: "Invalid request",
  });
});

app.use(
  (error: GlobalError, req: Request, res: Response, next: NextFunction) => {
    console.log(error.message || error);
    res.status(error.status || 500);
    res.json({ error: error.message || error || "an error occured" });
  }
);

const server = app.listen(8080, () => {
  console.log("listening on port 8080");
  try {
    initialize();
  } catch (err) {
    server.close();
  }
});
