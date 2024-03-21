import express from "express";
import {
  createChain,
  findAllChains,
  findOneChain,
  updateChain,
  deleteChain,
  deleteAllChains,
} from "../controllers/chains.controller.js";
import { authenticateServiceApiKey } from "../middleware/authMiddleware.js";

const chainsRouter = express.Router();

chainsRouter.post("/", authenticateServiceApiKey, createChain);

chainsRouter.get("/", authenticateServiceApiKey, findAllChains);

chainsRouter.get("/:id", authenticateServiceApiKey, findOneChain);

chainsRouter.put("/:id", authenticateServiceApiKey, updateChain);

chainsRouter.delete("/:id", authenticateServiceApiKey, deleteChain);

chainsRouter.delete("/", authenticateServiceApiKey, deleteAllChains);

export default chainsRouter;
