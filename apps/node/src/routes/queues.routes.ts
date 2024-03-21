import express from "express";
import {
  // getCustomerQueuesByStoreId,
  getCustomerQueuesByStoreIdREWORKED,
  createCustomerQueue,
  findAllCustomerQueues,
  findOneCustomerQueue,
  updateCustomerQueue,
  deleteCustomerQueue,
  deleteAllCustomerQueues,
  deleteAllCustomerQueueByStoreId,
  AddCustomerToQueue,
} from "../controllers/queues.controller.js";
import {
  authenticateServiceApiKey,
  authenticateB2CToken,
} from "../middleware/authMiddleware.js";
import propelAuth from "../utils/propelAuth.js";

const customerQueuesRouter = express.Router();

customerQueuesRouter.post("/", authenticateB2CToken, AddCustomerToQueue);

customerQueuesRouter.get(
  "/stores",
  propelAuth.requireUser,
  getCustomerQueuesByStoreIdREWORKED,
);

customerQueuesRouter.post("/", authenticateB2CToken, createCustomerQueue);

customerQueuesRouter.get("/", authenticateServiceApiKey, findAllCustomerQueues);

customerQueuesRouter.get(
  "/:id",
  authenticateServiceApiKey,
  findOneCustomerQueue,
);

customerQueuesRouter.put(
  "/:id",
  propelAuth.requireUser,
  updateCustomerQueue, // using
);

customerQueuesRouter.delete(
  "/:storeId/:queueId",
  authenticateServiceApiKey,
  deleteCustomerQueue,
);

customerQueuesRouter.delete(
  "/:storeId",
  authenticateServiceApiKey,
  deleteAllCustomerQueueByStoreId,
);

customerQueuesRouter.delete(
  "/",
  authenticateServiceApiKey,
  deleteAllCustomerQueues,
);

export default customerQueuesRouter;
