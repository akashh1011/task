import { Router } from "express";
import { exportProducts, getProducts, importProducts, updateProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

//import products

//post for import
router.route("/products/import").post(upload.single("file"),importProducts)

//get for export
router.route("/products/export").get(exportProducts)

//get for json list
router.route("/products").get(getProducts)

//put for update
router.route("/products/:id").put(updateProduct)


//route for log history

//router.route("/inventory/:productId/hisot")

export default router