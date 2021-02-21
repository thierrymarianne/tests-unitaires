const {Item} = require('../Item');
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

    static from(item) {
        return new ShoppingArticle(item);
    }
}

module.exports = ShoppingArticle;