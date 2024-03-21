import express from "express";
import {
  saveProductReview,
  getAllProductReviewsByCustomerId,
} from "../controllers/productReviews.controller.js";
import { authenticateB2CToken } from "../middleware/authMiddleware.js";

const productReviewsRouter = express.Router();

productReviewsRouter.post("/", authenticateB2CToken, saveProductReview);

productReviewsRouter.get(
  "/customers",
  authenticateB2CToken,
  getAllProductReviewsByCustomerId,
);

export default productReviewsRouter;
