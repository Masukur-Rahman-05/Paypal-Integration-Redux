import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'

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
app.use(cookieParser)



app.listen(3000, async(req , res)=>{
    console.log("server is running on port 3000")
})