import express from "express";
import {
  createInventory,
  findAllInventories,
  findSingleStoreInventory,
  findOneInventory,
  updateInventory,
  deleteInventory,
  deleteAllInventories,
  getSingleStoreInventoryIds,
} from "../controllers/inventories.controller.js";
import {
  authenticateServiceApiKey,
  authenticateB2CToken,
} from "../middleware/authMiddleware.js";

const inventoriesRouter = express.Router();

inventoriesRouter.post("/", authenticateServiceApiKey, createInventory);

inventoriesRouter.get("/", authenticateServiceApiKey, findAllInventories);

inventoriesRouter.get("/:id", authenticateServiceApiKey, findOneInventory);

inventoriesRouter.get(
  "/stores/:id",
  authenticateServiceApiKey,
  findSingleStoreInventory,
);

inventoriesRouter.get(
  "/stores/:storeId/inventory-ids",
  authenticateB2CToken,
  getSingleStoreInventoryIds,
);

inventoriesRouter.put("/:id", authenticateServiceApiKey, updateInventory);

inventoriesRouter.delete("/:id", authenticateServiceApiKey, deleteInventory);

inventoriesRouter.delete("/", authenticateServiceApiKey, deleteAllInventories);

export default inventoriesRouter;
