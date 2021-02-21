
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


    amendSellIn(sellIn) {
        if (this.sellIn() < sellIn) {
            throw 'Can not amend sellIn (inconsistent order)'
        }

        return new ShoppingArticle(
            new Item(
                this.name(),
                sellIn,
                this.quality()
            )
        );
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

        if (
            shoppingArticle.name() === ItemName.sulfurasHandOfRagnaros &&
            QualityAssurance.getStableQuality(shoppingArticle) !== shoppingArticle.quality()
        ) {
            QualityAssurance.throwNonCompliantQualityError(shoppingArticle);
        }

        return shoppingArticle;
    }
}

module.exports = ShoppingArticle;