import { Router } from "express";
import { importProducts } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

//import products
router.route("/import").post(upload.single("file"),importProducts)

export default router