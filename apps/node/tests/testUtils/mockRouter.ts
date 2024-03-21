import express from "express";
import retailChainsRouter from "../../src/routes/chains.routes";

const mockApp = express();

mockApp.use(express.json());
mockApp.disable("x-powered-by");

mockApp.use("/api/chains", retailChainsRouter);

export default mockApp;
