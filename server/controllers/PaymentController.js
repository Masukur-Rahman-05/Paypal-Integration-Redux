import {
  OrdersController,
  ApiError,
  CheckoutPaymentIntent,
} from "@paypal/paypal-server-sdk";
import { Payment } from "../models/Payment.js";
import { client } from "../config/paypal.js";

const ordersController = new OrdersController(client);

export const createOrder = async (req, res) => {
  try {
      const { cart } = req.body;
      const item = cart[0];

    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: item.amount,
            },
            description: item.name,
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, statusCode } = await ordersController.ordersCreate(collect);
    const responseBody = JSON.parse(body);

    // Create payment record
    await Payment.create({
      orderId: responseBody.id,
      paymentStatus: "CREATED",
    });

    res.status(statusCode).json(responseBody);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

export const captureOrder = async (req, res) => {
  try {
    const { orderID } = req.params;

    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, statusCode } = await ordersController.ordersCapture(collect);
    const responseBody = JSON.parse(body);

    // Update payment record
    await Payment.findOneAndUpdate(
      { orderId: orderID },
      {
        paymentId: responseBody.purchase_units[0].payments.captures[0].id,
        paymentStatus: responseBody.status,
      },
      { new: true }
    );

    res.status(statusCode).json(responseBody);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    return res.json(payment);
  } catch (error) {
    console.error("Failed to get payment:", error);
    res.status(500).json({ error: "Failed to get payment details" });
  }
};
