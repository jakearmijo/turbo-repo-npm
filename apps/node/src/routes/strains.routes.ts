import express from "express";
import {
  createStrain,
  findAllStrains,
  findOneStrain,
  updateStrain,
  deleteStrain,
  deleteAllStrains,
  bulkUpdateStrain,
} from "../controllers/strains.controller.js";
import { authenticateServiceApiKey } from "../middleware/authMiddleware.js";

const strainsRouter = express.Router();

strainsRouter.post("/", authenticateServiceApiKey, createStrain);

strainsRouter.post("/bulk-update", authenticateServiceApiKey, bulkUpdateStrain);

strainsRouter.get("/", authenticateServiceApiKey, findAllStrains);

strainsRouter.get("/:id", authenticateServiceApiKey, findOneStrain);

strainsRouter.put("/:id", authenticateServiceApiKey, updateStrain);

strainsRouter.delete("/:id", authenticateServiceApiKey, deleteStrain);

strainsRouter.delete("/", authenticateServiceApiKey, deleteAllStrains);

export default strainsRouter;
