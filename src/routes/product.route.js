import { Router } from "express";
import { exportProducts, importProducts } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

//import products
router.route("/products/import").post(upload.single("file"),importProducts)

router.route("/products/export").get(exportProducts)

export default router