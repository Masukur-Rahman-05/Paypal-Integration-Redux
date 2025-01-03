import React from "react"
import Product from "./pages/Product.jsx"
import { Route, Routes } from "react-router-dom"
import PaymentMethod from "./pages/PaymentMethod.jsx"
import PaymentSuccess from "./pages/PaymentSuccess.jsx"


function App() {
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Product/>}/>
        <Route path="/payment-method" element={<PaymentMethod/>}/>
        <Route path="/payment-success" element={<PaymentSuccess/>}/>
       

      </Routes>
   </div>
  )
}

export default App
