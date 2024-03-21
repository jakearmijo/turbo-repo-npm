import express from "express";
import { createTokenRequest } from "../controllers/ably.controller.js";

const ablyRouter = express.Router();

ablyRouter.get("/auth", createTokenRequest);

export default ablyRouter;
