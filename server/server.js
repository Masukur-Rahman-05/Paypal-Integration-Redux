import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import PaymentRoutes from './routes/PaymentRoutes.js'

const app = express()


app.use(
    cors({
        origin: "http://localhost:5173/",
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        Credential: true,
        allowHeaders:"Content-type,Authorization,Cache-control"
    })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api', PaymentRoutes)



app.listen(3000, async(req , res)=>{
    console.log("server is running on port 3000")
})