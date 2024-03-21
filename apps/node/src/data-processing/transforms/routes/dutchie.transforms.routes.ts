import express from "express";
import {
  dutchieProductCatalogTransform,
  dutchieInventoryTransform,
  dutchieStrainsTransform,
} from "../controllers/dutchie.transforms.controller.js";
import { authenticateServiceApiKey } from "../../../middleware/authMiddleware.js";

const dutchieTransformerRouter = express.Router();

dutchieTransformerRouter.post(
  "/products/list",
  authenticateServiceApiKey,
  dutchieProductCatalogTransform,
);

dutchieTransformerRouter.post(
  "/inventories/list",
  authenticateServiceApiKey,
  dutchieInventoryTransform,
);

dutchieTransformerRouter.post(
  "/strains/list",
  authenticateServiceApiKey,
  dutchieStrainsTransform,
);

dutchieTransformerRouter.post(
  "/customers/list",
  authenticateServiceApiKey,
  dutchieStrainsTransform,
);

export default dutchieTransformerRouter;
