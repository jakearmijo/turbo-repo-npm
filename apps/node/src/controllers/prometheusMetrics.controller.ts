import { Request, Response } from "express";
import { getPromRegistry } from "../app.js";

export const collectDefaultMetrics = async (req: Request, res: Response) => {
  try {
    const promRegistry = getPromRegistry();
    res.set("Content-Type", promRegistry.contentType);
    res.end(await promRegistry.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
};
