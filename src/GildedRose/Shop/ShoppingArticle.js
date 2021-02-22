
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

        this.item = new Item(item.name, item.sellIn(), item.quality());
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

    isSulfurasItem() {
        return this.name() === ItemName.sulfurasHandOfRagnaros;
    }

    amendQuality(quality) {
        if (quality < 0) {
            throw 'Quality can not be negative.'
        }

        if (quality > QualityAssurance.MAX_QUALITY) {
            throw `Quality can not be greater than ${QualityAssurance.MAX_QUALITY}.`
        }

        QualityAssurance.guardAgainstArticleHavingNonCompliantQuality(
            this,
            quality
        );

        return new ShoppingArticle(
            new Item(
                this.name(),
                this.sellIn(),
                quality
            )
        );
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

        if (QualityAssurance.isNotOfStandardQuality(shoppingArticle)) {
            return shoppingArticle;
        }

        QualityAssurance.guardAgainstArticleHavingNonCompliantQuality(
            shoppingArticle,
            shoppingArticle.quality()
        );

        return shoppingArticle;
    }
}

module.exports = ShoppingArticle;