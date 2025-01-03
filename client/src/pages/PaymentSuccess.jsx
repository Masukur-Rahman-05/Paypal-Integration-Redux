import React from 'react';

const PaymentSuccess = () => {
    return (
      <div className="relative w-screen h-screen flex flex-col justify-center items-center gap-5 bg-violet-100">
        <div className="absolute w-[350px] h-[350px] bg-pink-200 rounded-full blur-[80px] top-0 -left-40 z-20"></div>

        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Congratulation! Your payment was successful.
        </div>
      </div>
    );
};

export default PaymentSuccess;