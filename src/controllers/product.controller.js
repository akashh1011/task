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

//get products

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).lean();

  if (!products || products.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], "No products found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

//update products

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, unit, category, brand, stock, status, image } = req.body

  // 1. Check if product exists
  const product = await Product.findById(id)
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  const oldStock = product.stock

  // 2. Validation: stock must be numeric
  if (stock !== undefined && isNaN(Number(stock))) {
    throw new ApiError(400, "Stock must be a number")
  }

  // 3. Validation: unique name (only if name is changed)
  if (name && name !== product.name) {
    const existing = await Product.findOne({ name: name.trim() })
    if (existing) {
      throw new ApiError(400, "Product name must be unique")
    }
  }

  if (name) product.name = name.trim()
  if (unit) product.unit = unit.trim()
  if (category) product.category = category.trim()
  if (brand) product.brand = brand.trim()
  if (stock !== undefined) product.stock = Number(stock)
  if (status) product.status = status.trim()
  if (image) product.image = image.trim()

  // 5. Save updated product
  console.log({
  productId: product._id,
  oldStock,
  stockFromBody: stock,
  updatedStock: product.stock
});

  const updatedProduct = await product.save()

  return res.status(200).json(
    new ApiResponse(200, updatedProduct, "Product updated successfully")
  )
})


  

export { importProducts, exportProducts, getProducts,updateProduct };
