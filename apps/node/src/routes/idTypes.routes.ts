import express from "express";
import {
  createIdType,
  findAllIdTypes,
  findOneIdType,
  updateIdType,
  deleteIdType,
  deleteAllIdTypes,
  getIdTypesByState,
} from "../controllers/idTypes.controller.js";
import { authenticateServiceApiKey } from "../middleware/authMiddleware.js";

const idTypesRouter = express.Router();

idTypesRouter.post("/", authenticateServiceApiKey, createIdType);

idTypesRouter.get("/", authenticateServiceApiKey, findAllIdTypes);

idTypesRouter.get("/:id", authenticateServiceApiKey, findOneIdType);

idTypesRouter.put("/:id", authenticateServiceApiKey, updateIdType);

idTypesRouter.delete("/:id", authenticateServiceApiKey, deleteIdType);

idTypesRouter.delete("/", authenticateServiceApiKey, deleteAllIdTypes);

idTypesRouter.get("/store/:id", getIdTypesByState);

export default idTypesRouter;
