import express from "express";
import {
  getBasicAnalytics,
  getAggregatedCustomers,
} from "../controllers/analytics.controller.js";
import propelAuth from "../utils/propelAuth.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/:chainId", propelAuth.requireUser, getBasicAnalytics);

analyticsRouter.get(
  "/customers/:chainId",
  propelAuth.requireUser,
  getAggregatedCustomers,
);

export default analyticsRouter;
