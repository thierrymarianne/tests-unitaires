
const {Item, ItemName} = require('../Item');
const {QualityAssurance} = require('../../GildedRose');

class ShoppingArticle {
    constructor(item) {
        if (!(item instanceof Item)) {
            throw 'An instance of Item is required.'
        }

        if (!QualityAssurance.isOfAcceptableQuality(item)) {
            throw 'Item\'s quality is not good enough.'
        }

        this.item = item
    }

    name() {
        return this.item.name;
    }

    sellIn() {
        return this.item.sellIn;
    }

    quality() {
        return this.item.quality;
    }

    isInShopCatalogue() {
        return Object.values(ItemName).includes(this.name());
    }

    static from(item) {
        const shoppingArticle = new ShoppingArticle(item);

        if (!shoppingArticle.isInShopCatalogue()) {
            throw `Can not find item in shop by name: "${shoppingArticle.name()}"`
        }

        return shoppingArticle;
    }
}

module.exports = ShoppingArticle;