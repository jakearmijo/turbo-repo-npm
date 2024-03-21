import express from "express";

import propelAuth from "../utils/propelAuth.js";
import { getAllStoresMessagesByChainId } from "../controllers/messages.controller.js";

const messagesRouter = express.Router();

messagesRouter.get(
  "/:chainId",
  propelAuth.requireUser,
  getAllStoresMessagesByChainId,
);

export default messagesRouter;
