import { Router } from "express";
import { exportProducts, getInventoryHistory, getProducts, importProducts, updateProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

//import products

//post for import
router.route("api/products/import").post(upload.single("file"),importProducts)

//get for export
router.route("api/products/export").get(exportProducts)

//get for json list
router.route("api/products").get(getProducts)

//put for update
router.route("api/products/:id").put(updateProduct)


//route for log history

router.route("api/inventory/:productId/history").get(getInventoryHistory)

export default router