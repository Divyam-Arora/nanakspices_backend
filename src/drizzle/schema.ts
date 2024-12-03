import {
  integer,
  text,
  boolean,
  pgTable,
  uuid,
  bigint,
  pgEnum,
  varchar,
  PgBoolean,
  real,
  timestamp,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";

export const roles = pgEnum("roles", ["ADMIN", "CUSTOMER"]);

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 10 }).notNull().unique(),
  role: roles("role").default("CUSTOMER"),
  gstNumber: varchar("gst_number", { length: 15 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const product = pgTable("product", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  weight: integer("weight").notNull(),
  price: real("price").notNull(),
  availability: boolean("availability").default(true),
});

export const unit = pgTable("unit", {
  type: text("type").notNull().unique(),
  quantity: integer("quantity").notNull(),
});

export const address = pgTable("address", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id),
  line1: text("line1"),
  line2: text("line2"),
  city: text("city"),
  state: text("state"),
  pincode: varchar("pincode", { length: 6 }),
});

export const cart = pgTable(
  "cart",
  {
    userId: uuid("user_id").references(() => user.id),
    productId: uuid("product_id").references(() => product.id),
    unitType: text("unit_type").references(() => unit.type),
    quantity: integer("quantity"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.productId, table.unitType],
    }),
  })
);

export const orderStatus = pgEnum("orderStatus", [
  "PENDING",
  "DELIVERED",
  "CANCELLED",
]);
export const paymentStatus = pgEnum("orderStatus", [
  "PENDING",
  "RECEIVED",
  "NOT APPLICABLE",
]);

export const order = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id),
  price: numeric("price", { scale: 2 }),
  addressId: uuid("address_id").references(() => address.id),
  status: orderStatus("status").default("PENDING"),
  payment: paymentStatus("payment").default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderedProducts = pgTable(
  "ordered_products",
  {
    orderId: uuid("order_id").references(() => order.id),
    productId: uuid("product_is").references(() => product.id),
    unitType: text("unit_type").references(() => unit.type),
    quantity: integer("quantity"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.orderId, table.productId, table.unitType],
    }),
  })
);
