import express from "express";
import {
  createCustomerRecommendation,
  findAllCustomerRecommendations,
  findOneCustomerRecommendation,
  updateCustomerRecommendation,
  deleteCustomerRecommendation,
  deleteAllCustomerRecommendations,
  getRecommendationsForCustomerByCustomerId,
  getRecommendationForMatchAppCustomer,
  getRecommendationsForCustomerFallback,
} from "../controllers/recommendations.controller.js";
import {
  authenticateServiceApiKey,
  authenticateB2CToken,
} from "../middleware/authMiddleware.js";
import propelAuth from "../utils/propelAuth.js";

const customerRecommendationsRouter = express.Router();

customerRecommendationsRouter.get(
  "/fallback/customers",
  authenticateB2CToken,
  getRecommendationsForCustomerFallback,
);

customerRecommendationsRouter.get(
  "/customers/:customerId",
  authenticateB2CToken,
  getRecommendationForMatchAppCustomer,
);

customerRecommendationsRouter.get(
  "/bud-tender/customer/:customerId",
  propelAuth.requireUser,
  getRecommendationsForCustomerByCustomerId,
);

customerRecommendationsRouter.post(
  "/",
  authenticateB2CToken,
  createCustomerRecommendation,
);

customerRecommendationsRouter.get(
  "/",
  authenticateServiceApiKey,
  findAllCustomerRecommendations,
);

customerRecommendationsRouter.get(
  "/:id",
  authenticateServiceApiKey,
  findOneCustomerRecommendation,
);

customerRecommendationsRouter.put(
  "/:id",
  authenticateServiceApiKey,
  updateCustomerRecommendation,
);

customerRecommendationsRouter.delete(
  "/:id",
  authenticateServiceApiKey,
  deleteCustomerRecommendation,
);

customerRecommendationsRouter.delete(
  "/",
  authenticateServiceApiKey,
  deleteAllCustomerRecommendations,
);

export default customerRecommendationsRouter;
