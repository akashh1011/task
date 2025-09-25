import mongoose,{Schema} from "mongoose";
const inventorySchema = new Schema({

  productId:{
    type:Schema.Types.ObjectId,
    ref:"Product"
  },

  oldQuantity:{
    type:Number
  },

  newQuantity:{
    type:Number
  },

  date:{
    type:Date
  }


},{timestamps:true})

export const Inventory = mongoose.model("Inventory", inventorySchema)