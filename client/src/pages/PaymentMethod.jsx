import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { orderCapture, orderCreate } from "../Redux/PaymentSlice.js";

const PaymentMethod = () => {
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialOptions = {
    clientId:
      "AdaW3e-KJ-fEsPHCOu5KXkFhZey6BkbxPKD19G-tXuig3kGNDGYLWNOv53E-r-6VNwgJixRJg7cQCLHP",
    currency: "USD",
    intent: "capture",
  };

  const productData = {
    id: "iphone-18-pro-max",
    name: "Iphone 18 pro max",
    price: "1000.00",
  };

  const cart = [
    {
      id: productData.id,
      name: productData.name,
      quantity: 1,
      amount: productData.price,
    },
  ];

  const link =
    "https://076b-2404-1c40-162-3787-d04d-7d1e-845e-d6c1.ngrok-free.app";

  const createOrder = async () => {
    try {

      const response = await dispatch(orderCreate({ cart }))
      
      console.log(response.payload);
      return response.payload.id
    } catch (error) {
      setPaymentError(`Failed to create order: ${error.message}`);
      throw error;
    }
  };

   const fetchPaymentStatus = async (orderId) => {
     try {
       const response = await fetch(`${link}/api/payment/${orderId}`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       });

       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }

       const paymentData = await response.json();

       if (paymentData.error) {
         throw new Error(paymentData.error);
       }

       setPaymentStatus(`Payment Status: ${paymentData.paymentStatus}`);
     } catch (error) {
       // console.error("Payment status error:", error);
       // Don't show the error to the user since payment was successful
       setPaymentStatus("Payment completed successfully");
     }
   };

  const onApprove = async (data, actions) => {
    try {

      const response = await dispatch(orderCapture({ orderId: data.orderID }))
      
      console.log(response.payload)
      // const response = await fetch(
      //   `${link}/api/orders/capture/${data.orderID}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const orderData = await response.json();

      // if (orderData.error) {
      //   setPaymentError(`Payment failed: ${orderData.error}`);
      //   return;
      // }

      if (response.payload.paymentStatus === "COMPLETED") {
        setPaymentSuccess(`Payment completed! Order ID: ${data.orderID}`);
        // Add a slight delay before fetching payment status
        setTimeout(() => fetchPaymentStatus(data.orderID), 1000);
        navigate("/payment-success");
      } else {
        setPaymentError(`Payment capture failed!`);
      }
    } catch (error) {
      setPaymentError(`Payment failed: ${error.message}`);
    }
  };



   

  return (
    <div className="relative w-screen h-screen flex flex-col justify-center items-center gap-5 bg-violet-100">
      <div className="absolute w-[350px] h-[350px] bg-pink-200 rounded-full blur-[80px] top-0 -left-40 z-20"></div>

      {paymentError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {paymentError}
        </div>
      )}

      {paymentSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {paymentSuccess}
        </div>
      )}

      {paymentStatus && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          {paymentStatus}
        </div>
      )}

      <div>
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={{
              layout: "vertical",
              fundingicons: true,
            }}
            fundingSource="paypal"
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => {
              setPaymentError(`PayPal encountered an error: ${err.message}`);
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PaymentMethod;
