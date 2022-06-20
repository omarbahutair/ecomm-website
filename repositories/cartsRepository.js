const products = require('../views/products');
const Repository = require('./repository');
const productsRepo = require('./productsRepository')

class CartsRepository extends Repository {
}

module.exports = new CartsRepository('carts.json')