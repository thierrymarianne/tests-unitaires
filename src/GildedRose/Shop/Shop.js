
const Cart = require('./Cart');
const ShoppingArticle = require('./ShoppingArticle');

const {ItemName} = require('../Item');
const {QualityAssurance} = require('../../GildedRose');

class Shop {
    constructor(items = []) {
        this.cart = new Cart(items.map(i => ShoppingArticle.from(i)));
    }

    updateQuality() {
        return this.cart.assessQuality();
    }
}

module.exports = Shop;
