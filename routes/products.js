const express = require('express');
const session = require('cookie-session');


const productsIndexTemplate = require('../views/products/index')
const productsRepo = require('../repositories/productsRepository');
const cartRepository = require('../repositories/cartsRepository')

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({products}));
});

router.post('/cart/products/:id/add', async (req, res) => {
    if(! req.session.cartId){
        const cart = await cartRepository.create({products: []})
        req.session.cartId = cart.id;
    }
    const productId = req.params.id;
    const cartId = req.session.cartId;
    await cartRepository.add(cartId, productId);
    res.redirect('/')
})

module.exports = router;