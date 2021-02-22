const {Item, ItemName} = require('../Item');
const {QualityAssurance} = require('../../GildedRose');

class QualityError extends Error {
    constructor(
        shoppingArticle,
        message
    ) {
        super(message.replace('{name}', shoppingArticle.name()));
    }

    static guardAgainstNegativeQuality(quality, shoppingArticle) {
        if (quality < 0) {
            throw new QualityError(
                shoppingArticle,
                [
                    `Quality can not be negative for `,
                    `shopping article referenced under "{name}" name.`
                ].join('')
            );
        }
    }
}

class ShoppingArticle {
    constructor(item) {
        if (!(item instanceof Item)) {
            throw 'An instance of Item is required.'
        }

        if (!QualityAssurance.isOfAcceptableQuality(item)) {
            throw 'Item\'s quality is not good enough.'
        }

        this.item = new Item(item.name, item.sellIn, item.quality);
    }

    name() {
        return this.item.name;
    }

    isReferencedUnderTheName(name) {
        return this.name() === name;
    }

    isNotReferencedUnderTheName(name) {
        return !this.isReferencedUnderTheName(name);
    }

    belongsToCategoryOfArticlesWhichQualityCanIncreaseOverTime() {
        return this.isReferencedUnderTheName(ItemName.agedBrie) ||
            this.isReferencedUnderTheName(ItemName.backstagePasses);
    }

    sellIn() {
        return this.item.sellIn;
    }

    hasExpirationDatePassed() {
        return this.sellIn() < 0;
    }

    deriveQualityFromSellIn() {
        let shoppingArticle = this;

        shoppingArticle = shoppingArticle.chainSellInAmendments(
            s => {
                if (shoppingArticle.isNotReferencedUnderTheName(ItemName.sulfurasHandOfRagnaros)) {
                    return s - 1;
                }

                return s;
            }
        );

        if (!this.hasExpirationDatePassed()) {
            return shoppingArticle;
        }

        return shoppingArticle.chainQualityAmendments(
            q => {
                if (
                    shoppingArticle.isReferencedUnderTheName(ItemName.agedBrie) &&
                    QualityAssurance.isShoppingArticleBelowTheQualityStandard(shoppingArticle)
                ) {
                    return q + 1;
                }

                if (shoppingArticle.isReferencedUnderTheName(ItemName.backstagePasses)) {
                    return 0
                }

                return q;
            },
            q => {
                if (
                    shoppingArticle.hasSomeQualityLeft() &&
                    shoppingArticle.isNotReferencedUnderTheName(ItemName.sulfurasHandOfRagnaros)
                ) {
                    return q - 1;
                }

                return q;
            }
        );
    }

    quality() {
        return this.item.quality;
    }

    hasSomeQualityLeft() {
        return this.quality() > 0;
    }

    isSulfurasItem() {
        return this.name() === ItemName.sulfurasHandOfRagnaros;
    }

    unwrapItem() {
        return this.item;
    }

    chainQualityAmendments(...qualityAmendmentFns) {
        return qualityAmendmentFns.reduce((shoppingArticle, amendQuality) => {
            const quality = amendQuality(shoppingArticle.quality());

            return shoppingArticle.amendQuality(quality);
        }, this);
    }

    amendQuality(quality) {
        QualityError.guardAgainstNegativeQuality(quality, this);

        if (
            quality > QualityAssurance.MAX_QUALITY &&
            !this.isSulfurasItem()
        ) {
            throw `Quality can not be greater than ${QualityAssurance.MAX_QUALITY}.`
        }

        QualityAssurance.guardAgainstArticleHavingNonCompliantQuality(
            this,
            quality
        );

        this.item = new Item(
            this.name(),
            this.sellIn(),
            quality
        );

        return new ShoppingArticle(this.item);
    }

    amendSellIn(sellIn) {
        if (this.sellIn() < sellIn) {
            throw 'Can not amend sellIn (inconsistent order).'
        }

        if (this.isSulfurasItem() && sellIn !== this.sellIn()) {
            throw 'Can not amend sellIn of "Sulfuras" items.'
        }

        this.item = new Item(
            this.name(),
            sellIn,
            this.quality()
        );

        return new ShoppingArticle(this.item);
    }

    chainSellInAmendments(...sellInAmendmentFns) {
        return sellInAmendmentFns.reduce((shoppingArticle, amendSellIn) => {
            const sellIn = amendSellIn(shoppingArticle.sellIn());

            return shoppingArticle.amendSellIn(sellIn);
        }, this);
    }

    isNotInShopCatalogue() {
        return !Object.values(ItemName).includes(this.name());
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