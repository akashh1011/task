import { Product } from "../models/product.model.js";
import { parseCSVtoJSON } from "../utils/csvParser.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { writeJSONtoCSV } from "../utils/csvWriter.util.js";

// POST /api/products/import
const importProducts = asyncHandler(async (req, res) => {
  //console.log(req.file)
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  // Convert CSV to JSON
  const rows = await parseCSVtoJSON(req.file.path);

  const addedProducts = [];
  const skippedProducts = [];

  // process rows
  for (const row of rows) {
    const { name, unit, category, brand, stock, status, image } = row;

    // Validation
    if (!name || !unit || !category || !brand || !stock || !status) {
      skippedProducts.push({ name, reason: "Missing required fields" });
      continue;
    }

    // Duplicate check
    const existing = await Product.findOne({ name });
    if (existing) {
      skippedProducts.push({ name, reason: "Already exists" });
      continue;
    }

    // Insert new product
    const product = new Product({
      name,
      unit,
      category,
      brand,
      stock: Number(stock),
      status,
      image,
    });
    await product.save();
    addedProducts.push(product);
  }

  // Send formatted response

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        addedCount: addedProducts.length,
        skippedCount: skippedProducts.length,
        skipped: skippedProducts,
      },
      "Products imported successfully"
    )
  );
});

//export GET request

const exportProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).lean();

  if (!products || products.length === 0) {
    return res.status(404).json({ message: "No products found" });
  }

  await writeJSONtoCSV(products, res);
});

export { importProducts, exportProducts };
