import mongoose,{Schema} from "mongoose";
const inventorySchema = new Schema({

  productId:{
    type:Schema.Types.ObjectId,
    ref:"Product",
    required:true
  },

  oldQuantity:{
    type:Number,
    required:true
  },

  newQuantity:{
    type:Number,
    required:true
  },

  changedAt:{
    type:Date,
    default:Date.now
  }

},{timestamps:true})

export const Inventory = mongoose.model("Inventory", inventorySchema)