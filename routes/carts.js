const express = require("express");

const cartsRepo = require("../repositories/cartsRepository");
const productsRepo = require("../repositories/productsRepository");
const cartShowTemplate = require("../views/carts/show");

const router = express.Router();

router.post("/cart/products", async (req, res) => {
  //check if cart has been created
  if (!req.session.cartId) {
    //cart does not exist
    //if cart does not exist create new one
    const cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  }
  //we have a cart in this line
  //get the cart from the database
  // update the product added to the cart by incrementing the quantity or setting it to 1
  const cart = await cartsRepo.getOne(req.session.cartId);
  //get the items inside the cart
  const { items } = cart;
  //figure out wether the added item exists or not in the cart
  let item = items.find((item) => item._id === req.body.productId);
  if (item) {
    //if it exists increment by 1 to the quantity property of the item
    item.quantity++;
  } else {
    //if not create new item with the properties of id: the product id and the quantity with value of 1
    items.push({ id: req.body.productId, quantity: 1 });
  }

  cartsRepo.update(req.session.cartId, { items });
  res.redirect("/");
});

router.get("/cart", async (req, res) => {
  //check if user have a cart
  //if not create new one
  if (!req.session.cartId) {
    res.redirect("/");
  }
  //get cart
  const cart = await cartsRepo.getOne(req.session.cartId);
  //get all items inside the cart and assign the product object to them
  //---get the items inside it and reset each index to be an object the includes a product element
  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items, cartId: req.session.cartId }));
});

router.post("/cart/products/delete", async (req, res) => {
  // delete an element from an object using update
  // - dec if quantity higher than 1
  // - del if quantity is 1
  //get cart
  const cart = await cartsRepo.getOne(req.session.cartId);
  //get index of the item refered to by the req.body.itemId
  const item = cart.items.find((item) => item.id === req.body.itemId);
  //if item does not exist
  if (!item) {
    //redirect to cart
    return res.redirect("/cart");
  }
  //if exists check the item quantity is greater than one
  if (item.quantity > 1) {
    //if yes reduce the quantity by one
    item.quantity--;
  } else {
    //if not remove item from cart
    cart.items.splice(cart.items.indexOf(item), 1);
  }
  //update cart
  cartsRepo.update(req.session.cartId, {
    items: cart.items,
  });
  //redirect to cart
  return res.redirect("/cart");
});

module.exports = router;
