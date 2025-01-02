import React from "react"
import Product from "./pages/Product.jsx"
import { Route, Routes } from "react-router-dom"
import PaymentMethod from "./pages/PaymentMethod.jsx"


function App() {
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Product/>}/>
        <Route path="/payment-method" element={<PaymentMethod/>}/>
       

      </Routes>
   </div>
  )
}

export default App
