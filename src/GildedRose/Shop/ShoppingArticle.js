
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

    isNotOfStableQuality() {
        const isOfStableQuality = typeof QualityAssurance.STABLE_QUALITY_OVER_TIME[this.name()] !== 'undefined';

        if (isOfStableQuality) {
            return false
        }

        return true;
    }

    getStableQuality() {
        if (this.isNotOfStableQuality()) {
            throw 'This item is not of stable quality';
        }

        return QualityAssurance.STABLE_QUALITY_OVER_TIME[this.name()];
    }

    isNotInShopCatalogue() {
        return ! Object.values(ItemName).includes(this.name());
    }

    static from(item) {
        const shoppingArticle = new ShoppingArticle(item);

        if (shoppingArticle.isNotInShopCatalogue()) {
            throw `Can not find item in shop by name: "${shoppingArticle.name()}"`
        }

        if (shoppingArticle.isNotOfStableQuality()) {
            return shoppingArticle;
        }

        if (shoppingArticle.getStableQuality() !== shoppingArticle.quality()) {
            throw [
                `"${ItemName.sulfurasHandOfRagnaros}" items are legendary, `,
                'hence their quality have to be compliant with a standard of ',
                `${shoppingArticle.getStableQuality()}.`
            ].join('')
        }

        return shoppingArticle;
    }
}

module.exports = ShoppingArticle;