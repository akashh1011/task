import express from "express"
import cors from "cors"
import productRouter from "../src/routes/product.route.js"
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))


//route initialize
app.use("/api", productRouter)

export default app