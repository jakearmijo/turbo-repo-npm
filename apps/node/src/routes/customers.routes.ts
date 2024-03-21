import express from "express";
import {
  authenticateB2CToken,
  authenticateServiceApiKey,
} from "../middleware/authMiddleware.js";
import {
  createCustomer,
  findAllCustomers,
  findOneCustomer,
  updateCustomer,
  deleteCustomer,
  deleteAllCustomers,
  // CreateNewCustomer,
  SearchForCustomer,
  LoginCustomerByMobilePassword,
  ResetPasswordOfCustomer,
  CheckIfCustomerExists,
  SendCustomerRestPasswordResetEmail,
  findAnonymousCustomerByEmailApi,
  findRetailCustomerStoreCategoryRelation,
} from "../controllers/customers.controller.js";

const customersRouter = express.Router();

customersRouter.post("/", createCustomer);

customersRouter.post("/login", LoginCustomerByMobilePassword);

customersRouter.get("/", authenticateServiceApiKey, findAllCustomers);

customersRouter.get("/email/:email", findAnonymousCustomerByEmailApi);
customersRouter.get(
  "/anonymousId/:anonymousId/:storeId",
  findRetailCustomerStoreCategoryRelation,
);

customersRouter.get("/:id", authenticateServiceApiKey, findOneCustomer);

customersRouter.put("/:id", authenticateB2CToken, updateCustomer);

customersRouter.delete("/:id", authenticateServiceApiKey, deleteCustomer);

customersRouter.delete("/", authenticateServiceApiKey, deleteAllCustomers);

customersRouter.post("/search", SearchForCustomer);

customersRouter.post(
  "/exists",
  authenticateServiceApiKey,
  CheckIfCustomerExists,
);

customersRouter.post("/password/reset", ResetPasswordOfCustomer);

customersRouter.post(
  "/password/reset/link",
  SendCustomerRestPasswordResetEmail,
);

export default customersRouter;
