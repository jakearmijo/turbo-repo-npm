import express from "express";
import { collectDefaultMetrics } from "../controllers/prometheusMetrics.controller.js";
import { authenticateGrafana } from "../middleware/authMiddleware.js";

const prometheusMetricsRouter = express.Router();

prometheusMetricsRouter.get("/", authenticateGrafana, collectDefaultMetrics);

export default prometheusMetricsRouter;
