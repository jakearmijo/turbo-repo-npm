import express from "express";
import {
  createStoreEmployee,
  findAllEmployees,
  findAllStoreEmployees,
  findAllOrgEmployees,
  findOneStoreEmployee,
  updateStoreEmployee,
  deleteStoreEmployee,
  deleteAllStoreEmployees,
  updateRetailStoreEmployeeLoginCount,
  updateRetailStoreEmployeeStatus,
  getRetailStoreEmployeeStatus,
  sendHelpRequestEmail,
  getUserInformationByExtId,
} from "../controllers/employees.controller.js";
import { authenticateServiceApiKey } from "../middleware/authMiddleware.js";
import propelAuth from "../utils/propelAuth.js";

const storeEmployeesRouter = express.Router();

storeEmployeesRouter.post(
  "/support/requests",
  propelAuth.requireUser,
  sendHelpRequestEmail,
);

storeEmployeesRouter.put(
  "/:id",
  authenticateServiceApiKey,
  updateStoreEmployee,
);

storeEmployeesRouter.put(
  "/update-login-count/:employeeId",
  authenticateServiceApiKey,
  updateRetailStoreEmployeeLoginCount,
);

storeEmployeesRouter.put(
  "/update-status/:employeeExtId",
  propelAuth.requireUser,
  updateRetailStoreEmployeeStatus,
);

storeEmployeesRouter.get(
  "/status/:employeeExtId",
  propelAuth.requireUser,
  getRetailStoreEmployeeStatus,
);

storeEmployeesRouter.delete(
  "/:id",
  authenticateServiceApiKey,
  deleteStoreEmployee,
);

storeEmployeesRouter.post("/", authenticateServiceApiKey, createStoreEmployee);

storeEmployeesRouter.get("/", authenticateServiceApiKey, findAllEmployees);

storeEmployeesRouter.get(
  "/:storeId",
  authenticateServiceApiKey,
  findAllStoreEmployees,
);

storeEmployeesRouter.get(
  "/org/:extOrgId",
  authenticateServiceApiKey,
  findAllOrgEmployees,
);

storeEmployeesRouter.get(
  "/:storeId/:employeeId",
  authenticateServiceApiKey,
  findOneStoreEmployee,
);

storeEmployeesRouter.delete(
  "/",
  authenticateServiceApiKey,
  deleteAllStoreEmployees,
);

storeEmployeesRouter.get(
  "/application/users/ext-id",
  propelAuth.requireUser,
  getUserInformationByExtId,
);

export default storeEmployeesRouter;
