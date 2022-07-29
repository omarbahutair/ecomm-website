const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
  ],
});

const Cart = mongoose.model("cart", CartSchema);

module.exports = Cart;
