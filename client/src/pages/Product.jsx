import React from "react";
import product from "../assets/product.jpg";
import { useNavigate } from "react-router-dom";
const Product = () => {
  const navigate = useNavigate();
  return (
      <div className=" relative w-screen h-screen flex flex-col justify-center items-center gap-5 bg-violet-100">
          <div className="absolute w-[350px] h-[350px] bg-pink-200 rounded-full blur-[80px] top-0 -left-40 z-20"></div>
          {/* <div className="absolute w-[450px] h-[450px] bg-violet-200 rounded-full blur-[90px] bottom-10 right-20 z-20"></div> */}
          
      <div className="w-[300px] h-[400px] bg-gray-100 rounded-2xl shadow-2xl z-30">
        <div>
          <img
            className="w-full h-[300px] object-cover rounded-t-2xl"
            src={product}
            alt=""
          />
        </div>

        <div className="p-5 space-y-4">
          <h2 className="font-bold text-xl ">Iphone 18 pro max</h2>
          <p className="font-bold text-green-600">$1000</p>
        </div>
      </div>
      <button
        className="w-32 h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate("/payment-method")}
      >
        Buy Now
      </button>
    </div>
  );
};

export default Product;
