import {
  OrdersController,
  ApiError,
  CheckoutPaymentIntent,
} from "@paypal/paypal-server-sdk";
import { Payment } from "../models/Payment.js";
import { client } from "../config/paypal.js";
import { response } from "express";

const ordersController = new OrdersController(client);

// Create Order API
export const createOrder = async (req, res) => {
  try {
    const { cart } = req.body;
    const item = cart[0]; // Assuming the cart always has at least one item

    const collect = {
      body: {
        intent: "CAPTURE", // Intent to capture payment
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD", // Currency
              value: item.amount, // Amount from cart
            },
            description: item.name, // Product description
          },
        ],
      },
      prefer: "return=minimal", // Minimize the response payload
    };

    // Call PayPal to create the order
    const { body, statusCode } = await ordersController.ordersCreate(collect);
    
    const responseBody = typeof body === "string" ? JSON.parse(body) : body;
    // console.log("Response Body:", responseBody);

    // Ensure response contains orderId
    if (responseBody.id) {
      // Create a payment record in the database
      await Payment.create({
        orderId: responseBody.id,
        paymentStatus: "CREATED", // Payment status initially is created
      });

      // Send the order details back to the frontend
      res.status(statusCode).json(responseBody);
    } else {
      res
        .status(500)
        .json({ error: "Order creation failed: No order ID returned" });
    }
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

// Capture Order API
export const captureOrder = async (req, res) => {
  try {
    const { orderID } = req.params;

    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, statusCode } = await ordersController.ordersCapture(collect);
    const responseBody = JSON.parse(body);

    // Check for successful capture
    if (responseBody.status === "COMPLETED") {
      // Update payment record
      await Payment.findOneAndUpdate(
        { orderId: orderID },
        {
          paymentId: responseBody.purchase_units[0].payments.captures[0].id,
          paymentStatus: responseBody.status,
        },
        { new: true }
      );

      return res.status(statusCode).json({
        message: "Payment successfully captured",
        orderID,
        paymentStatus: responseBody.status,
        responseBody,
      });
    } else {
      // If capture is not successful, send an error response
      return res.status(400).json({
        error: "Payment capture failed",
        orderID,
        paymentStatus: responseBody.status,
      });
    }
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};

// Get Payment Status API
export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });

    // If no payment record is found, return a 404 error
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Return the payment status record to the frontend
    return res.json(payment);
  } catch (error) {
    console.error("Failed to get payment:", error);
    res.status(500).json({ error: "Failed to get payment details" });
  }
};

