import express from "express";
import {
  createOrder,
  captureOrder,
  getPaymentStatus,
} from "../controllers/PaymentController.js";

const router = express.Router();

router.post("/orders", createOrder);
router.post("/orders/capture/:orderID", captureOrder);
router.get("/payment/:orderId", getPaymentStatus);

export default router;
