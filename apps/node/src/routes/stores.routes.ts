import express from "express";
import {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteRetailStore,
  deleteAllRetailStores,
  getStoresByExternalOrgId,
  getStoresOfTheSameChainByStoreId,
} from "../controllers/stores.controller.js";
import { authenticateServiceApiKey } from "../middleware/authMiddleware.js";

const storesRouter = express.Router();

storesRouter.get("/", getAllStores);

storesRouter.get("/chainstores/:storeId", getStoresOfTheSameChainByStoreId);

storesRouter.post("/", authenticateServiceApiKey, createStore);

storesRouter.get("/:id", getStoreById);

storesRouter.put("/:id", authenticateServiceApiKey, updateStore);

storesRouter.delete("/:id", authenticateServiceApiKey, deleteRetailStore);

storesRouter.delete("/", authenticateServiceApiKey, deleteAllRetailStores);

storesRouter.get("/chain/:extOrgId", getStoresByExternalOrgId);

export default storesRouter;
