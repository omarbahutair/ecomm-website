const express = require("express");
const multer = require("multer");

const newProductTemplate = require("../../views/admin/products/new");
const productsRepo = require("../../repositories/productsRepository");
const { requireTitle, requirePrice } = require("./validators");
const { handleErrors, requireAuth, requireProduct } = require("./middlewares");
const renderProducts = require("../../views/admin/products/index");
const editProductTemplate = require("../../views/admin/products/edit");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", requireAuth, async (req, res) => {
  //get all the products and render it using renderProducts
  res.send(renderProducts({ products: await productsRepo.getAll() }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(newProductTemplate({}));
});

router.post(
  "/admin/products/new",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(newProductTemplate),
  async (req, res) => {
    // create product in the database
    await productsRepo.create({
      title: req.body.title,
      price: req.body.price,
      img: req.file ? req.file.buffer.toString("base64") : null,
    });
    return res.redirect("/admin/products");
  }
);

router.get("/admin/products/:id/edit", requireProduct, async (req, res) => {
  // get the product from the database using the id in req.params
  const product = await productsRepo.getOne(req.params.id);
  res.send(editProductTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(editProductTemplate, async (req) => {
    // get the product from the database
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    if (req.file) {
      req.body.img = req.file.buffer.toString("base64");
    }
    try {
      // update a record by id
      await productsRepo.update(req.params.id, req.body);
    } catch (err) {
      res.send("item not found");
    }
    res.redirect("/admin/products");
  }
);

router.post(
  "/admin/products/:id/delete",
  requireAuth,
  requireProduct,
  async (req, res) => {
    // deletes a product from the database by the id
    await productsRepo.delete(req.params.id);
    res.redirect("/admin/products");
  }
);

module.exports = router;
