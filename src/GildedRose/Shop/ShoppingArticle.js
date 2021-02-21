
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

    isNotInShopCatalogue() {
        return ! Object.values(ItemName).includes(this.name());
    }

    static from(item) {
        const shoppingArticle = new ShoppingArticle(item);

        if (shoppingArticle.isNotInShopCatalogue()) {
            throw `Can not find item in shop by name: "${shoppingArticle.name()}"`
        }

        if (QualityAssurance.isNotOfStableQuality(shoppingArticle)) {
            return shoppingArticle;
        }

        if (QualityAssurance.getStableQuality(shoppingArticle) !== shoppingArticle.quality()) {
            throw [
                `"${ItemName.sulfurasHandOfRagnaros}" items are legendary, `,
                'hence their quality have to be compliant with a standard of ',
                `${QualityAssurance.getStableQuality(shoppingArticle)}.`
            ].join('')
        }

        return shoppingArticle;
    }
}

module.exports = ShoppingArticle;