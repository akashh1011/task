import express from "express"
import cors from "cors"
import productRouter from "../src/routes/product.route.js"
const app = express()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))






//route initialize
app.use("/", productRouter)

export default app