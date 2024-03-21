import express from "express";
import {
  createProductCatalog,
  findAllProductCatalogs,
  findOneProductCatalog,
  updateProductCatalog,
  deleteProductCatalog,
  deleteAllProductCatalogs,
} from "../controllers/productCatalogs.controller.js";
import { authenticateServiceApiKey } from "../middleware/authMiddleware.js";

const productCatalogsRouter = express.Router();

productCatalogsRouter.post(
  "/",
  authenticateServiceApiKey,
  createProductCatalog,
);

productCatalogsRouter.get(
  "/",
  authenticateServiceApiKey,
  findAllProductCatalogs,
);

productCatalogsRouter.get(
  "/:id",
  authenticateServiceApiKey,
  findOneProductCatalog,
);

productCatalogsRouter.put(
  "/:id",
  authenticateServiceApiKey,
  updateProductCatalog,
);

productCatalogsRouter.delete(
  "/:id",
  authenticateServiceApiKey,
  deleteProductCatalog,
);

productCatalogsRouter.delete(
  "/",
  authenticateServiceApiKey,
  deleteAllProductCatalogs,
);

export default productCatalogsRouter;
