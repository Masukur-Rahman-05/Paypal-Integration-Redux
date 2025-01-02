import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


const PaymentMethod = () => {
  const initialOptions = {
    clientId:
      "AdaW3e-KJ-fEsPHCOu5KXkFhZey6BkbxPKD19G-tXuig3kGNDGYLWNOv53E-r-6VNwgJixRJg7cQCLHP",
    currency: "USD",
    intent: "capture",
  };

    return (
      <div className=" relative w-screen h-screen flex flex-col justify-center items-center gap-5 bg-violet-100">
        <div className="absolute w-[350px] h-[350px] bg-pink-200 rounded-full blur-[80px] top-0 -left-40 z-20"></div>

        <div>
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{
                layout: "vertical", // Vertical layout removes unnecessary buttons
                fundingicons: false, // Removes funding icons
              }}
              fundingSource="paypal" // Ensures only the PayPal button appears
            />
          </PayPalScriptProvider>
        </div>
      </div>
    );
};

export default PaymentMethod;