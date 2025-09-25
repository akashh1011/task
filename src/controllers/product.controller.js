import { Product } from "../models/product.model.js"
import { parseCSVtoJSON } from "../utils/csvParser.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

// POST /api/products/import
export const importProducts = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded")
  }

  // Convert CSV to JSON
  const rows = await parseCSVtoJSON(req.file.path)

  const addedProducts = []
  const skippedProducts = []

  // process rows
  for (const row of rows) {
    const { name, unit, category, brand, stock, status, image } = row

    // Validation
    if (!name || !unit || !category || !brand || !stock || !status) {
      skippedProducts.push({ name, reason: "Missing required fields" })
      continue
    }

    // Duplicate check
    const existing = await Product.findOne({ name })
    if (existing) {
      skippedProducts.push({ name, reason: "Already exists" })
      continue
    }

    // Insert new product
    const product = new Product({
      name,
      unit,
      category,
      brand,
      stock: Number(stock),
      status,
      image
    })
    await product.save()
    addedProducts.push(product)
  }

  // Send formatted response

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        addedCount: addedProducts.length,
        skippedCount: skippedProducts.length,
        skipped: skippedProducts
      },
      "Products imported successfully"
    )
  )
})
