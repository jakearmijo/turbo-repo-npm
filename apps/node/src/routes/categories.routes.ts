import express from "express";
import {
  createCategory,
  findAllCategories,
  findOneCategory,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
} from "../controllers/categories.controller.js";
import { authenticateServiceApiKey } from "../middleware/authMiddleware.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", authenticateServiceApiKey, createCategory);

categoriesRouter.get("/", authenticateServiceApiKey, findAllCategories);

categoriesRouter.get("/:id", authenticateServiceApiKey, findOneCategory);

categoriesRouter.put("/:id", authenticateServiceApiKey, updateCategory);

categoriesRouter.delete("/:id", authenticateServiceApiKey, deleteCategory);

categoriesRouter.delete("/", authenticateServiceApiKey, deleteAllCategories);

export default categoriesRouter;
