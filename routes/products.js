const express = require("express");
const session = require("cookie-session");

const productsIndexTemplate = require("../views/products/index");
const productsRepo = require("../repositories/productsRepository");
const cartRepository = require("../repositories/cartsRepository");

const router = express.Router();

router.get("/", async (req, res) => {
  // get All products
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

module.exports = router;
