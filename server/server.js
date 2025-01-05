import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import PaymentRoutes from './routes/PaymentRoutes.js'
import {connectDB} from './database.js'

const app = express()


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders:
      "Content-Type,Authorization,Cache-Control,ngrok-skip-browser-warning",
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api', PaymentRoutes)


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(3000, async(req , res)=>{
    console.log("server is running on port 3000")
    await connectDB()
})