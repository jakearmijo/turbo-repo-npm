import express from "express";
import {
  createFormRequest,
  findAllFormRequests,
  findOneFormRequest,
  updateFormRequest,
  deleteFormRequest,
  deleteAllFormRequests,
} from "../controllers/formRequests.controller.js";
import {
  authenticateServiceApiKey,
  authenticateB2CToken,
} from "../middleware/authMiddleware.js";

const formRequestsRouter = express.Router();

formRequestsRouter.post("/", authenticateB2CToken, createFormRequest);

formRequestsRouter.get("/", authenticateServiceApiKey, findAllFormRequests);

formRequestsRouter.get("/:id", authenticateServiceApiKey, findOneFormRequest);

formRequestsRouter.put("/:id", authenticateServiceApiKey, updateFormRequest);

formRequestsRouter.delete("/:id", authenticateServiceApiKey, deleteFormRequest);

formRequestsRouter.delete(
  "/",
  authenticateServiceApiKey,
  deleteAllFormRequests,
);

export default formRequestsRouter;
