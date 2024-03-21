import express from "express";
import {
  setUserCartInCache,
  getUserCartFromCache,
  createDutchieOrder,
} from "../controllers/storeCarts.controller.js";
import { authenticateServiceApiKey } from "../middleware/authMiddleware.js";

const CustomerStoreCartRouter = express.Router();

CustomerStoreCartRouter.post(
  "/set-cart",
  authenticateServiceApiKey,
  setUserCartInCache,
);

CustomerStoreCartRouter.get(
  "/get-cart/:storeId/:customerId",
  getUserCartFromCache,
);

CustomerStoreCartRouter.post(
  "/submit-order",
  authenticateServiceApiKey,
  createDutchieOrder,
);

export default CustomerStoreCartRouter;
