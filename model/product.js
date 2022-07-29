const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: String,
  price: Number,
  image: String,
  involvedCarts: [
    {
      id: Schema.Types.ObjectId,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;
