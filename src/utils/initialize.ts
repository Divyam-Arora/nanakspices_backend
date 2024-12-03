import { createAdmin, getUserById } from "../models/userModel";

export const initialize = () => {
  getUserById("admin").then((admin) => {
    !admin &&
      createAdmin({
        id: "admin",
        name: "admin",
        firm: "Sunil Industries",
        password: Bun.password.hashSync(Bun.env.ADMIN_PASSWORD as string, {
          algorithm: "bcrypt",
          cost: 4,
        }),
        phoneNumber: Bun.env.ADMIN_NUMBER as string,
        email: Bun.env.ADMIN_EMAIL as string,
      })
        .then((admin) => console.log("admin created!"))
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
  });
};
