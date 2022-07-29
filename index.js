const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");

const User = require("./model/user");
const Cart = require("./model/cart");
const Product = require("./model/product");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/carts");

mongoose.connect("mongodb://localhost/ecomm");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["flutbrtmiaptiwetnWTpia058a420q34vnp4v8[2-qb9-3v9n-0w385vb3qc80"],
  })
);
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartRouter);

app.listen(3000, () => {
  console.log("Listening");
});
