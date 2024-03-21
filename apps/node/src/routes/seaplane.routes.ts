import express from "express";
import { recommendationV2 } from "../controllers/seaplane.controller.js";
import { authenticateSeaplaneApiKey } from "../middleware/authMiddleware.js";

const seaPlaneRouter = express.Router();

seaPlaneRouter.post(
  "/recommendations/v2",
  authenticateSeaplaneApiKey,
  recommendationV2,
);

export default seaPlaneRouter;
