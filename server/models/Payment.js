import mongoose from 'mongoose'

const PaymentSchema = mongoose.Schema({
    orderId: String,
    paymentId: String,
    paymentStatus:String
})

export const Payment = mongoose.model('payment',PaymentSchema)