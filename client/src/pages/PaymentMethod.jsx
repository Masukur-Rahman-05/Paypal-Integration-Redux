import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaymentMethod = () => {
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

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

  const link =
    "https://d902-2404-1c40-166-c5ee-4d87-f582-39a0-5914.ngrok-free.app";

  const createOrder = async () => {
    try {
      const response = await fetch(`${link}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [
            {
              id: productData.id,
              name: productData.name,
              quantity: 1,
              amount: productData.price,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orderData = await response.json();
      if (orderData.id) {
        return orderData.id;
      } else {
        throw new Error("Failed to create order");
      }
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
      console.error("Payment status error:", error);
      // Don't show the error to the user since payment was successful
      setPaymentStatus("Payment completed successfully");
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const response = await fetch(
        `${link}/api/orders/capture/${data.orderID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orderData = await response.json();

      if (orderData.error) {
        setPaymentError(`Payment failed: ${orderData.error}`);
        return;
      }

      if (orderData.paymentStatus === "COMPLETED") {
        setPaymentSuccess(`Payment completed! Order ID: ${data.orderID}`);
        // Add a slight delay before fetching payment status
        setTimeout(() => fetchPaymentStatus(data.orderID), 1000);
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

// import React, { useState } from "react";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// const PaymentMethod = () => {
//   const [paymentError, setPaymentError] = useState("");
//   const [paymentSuccess, setPaymentSuccess] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const initialOptions = {
//     clientId:
//       "AdaW3e-KJ-fEsPHCOu5KXkFhZey6BkbxPKD19G-tXuig3kGNDGYLWNOv53E-r-6VNwgJixRJg7cQCLHP",
//     currency: "USD",
//     intent: "capture",
//   };

//   const productData = {
//     id: "iphone-18-pro-max",
//     name: "Iphone 18 pro max",
//     price: "1000.00",
//   };

//   const link =
//     " https://d902-2404-1c40-166-c5ee-4d87-f582-39a0-5914.ngrok-free.app";

//   const createOrder = async () => {
//     try {
//       const response = await fetch(`${link}/api/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           cart: [
//             {
//               id: productData.id,
//               name: productData.name,
//               quantity: 1,
//               amount: productData.price,
//             },
//           ],
//         }),
//       });

//       const orderData = await response.json();

//       if (orderData.id) {
//         return orderData.id;
//       } else {
//         throw new Error("Failed to create order");
//       }
//     } catch (error) {
//       setPaymentError(`Failed to create order: ${error.message}`);
//       throw error;
//     }
//   };

//   const onApprove = async (data, actions) => {
//     try {
//       // const response = await fetch(`/api/orders/${data.orderID}/capture`, {
//       const response = await fetch(
//         `${link}/api/orders/capture/${data.orderID}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const orderData = await response.json();

//       if (orderData.error) {
//         throw new Error(orderData.error);
//       }

//       // Check the order status
//       const captureStatus = orderData.status;

//       if (captureStatus === "COMPLETED") {
//         setPaymentSuccess(`Payment completed! Order ID: ${data.orderID}`);
//         // Here you can redirect to success page or update your database
//         fetchPaymentStatus(data.orderID); // Fetch payment status after successful capture
//       }
//     } catch (error) {
//       console.log(error.message);
//       setPaymentError(`Payment failed: ${error.message}`);
//     }
//   };

//   // New function to fetch payment status
//   const fetchPaymentStatus = async (orderId) => {
//     try {
//       const response = await fetch(`${link}/api/payment/${orderId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const paymentData = await response.json();

//       if (paymentData.error) {
//         throw new Error(paymentData.error);
//       }

//       setPaymentStatus(`Payment Status: ${paymentData.paymentStatus}`);
//     } catch (error) {
//       setPaymentError(`Failed to fetch payment status: ${error.message}`);
//     }
//   };

//   return (
//     <div className=" relative w-screen h-screen flex flex-col justify-center items-center gap-5 bg-violet-100">
//       <div className="absolute w-[350px] h-[350px] bg-pink-200 rounded-full blur-[80px] top-0 -left-40 z-20"></div>

//       {/* Error Message */}
//       {paymentError && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {paymentError}
//         </div>
//       )}

//       {/* Success Message */}
//       {paymentSuccess && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//           {paymentSuccess}
//         </div>
//       )}

//       <div>
//         <PayPalScriptProvider options={initialOptions}>
//           <PayPalButtons
//             style={{
//               layout: "vertical", // Vertical layout removes unnecessary buttons
//               fundingicons: true, // Removes funding icons
//             }}
//             fundingSource="paypal" // Ensures only the PayPal button appears
//             createOrder={createOrder}
//             onApprove={onApprove}
//             onError={(err) => {
//               setPaymentError(`PayPal encountered an error: ${err.message}`);
//             }}
//           />
//         </PayPalScriptProvider>
//       </div>
//     </div>
//   );
// };

// export default PaymentMethod;
