const {Item, ItemName} = require('../Item');
const {QualityAssurance} = require('../../GildedRose');

class QualityError extends Error {
    constructor(
        shoppingArticle,
        message = [
            `Quality can not be negative for `,
            `shopping article referenced under "{name}" name.`
        ].join('')
    ) {
        super(message.replace('{name}', shoppingArticle.name()));
    }

    static guardAgainstNegativeQuality(quality, shoppingArticle) {
        if (quality < 0) {
            throw new QualityError(shoppingArticle);
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

    sellIn() {
        return this.item.sellIn;
    }

    hasExpirationDatePassed() {
        return this.sellIn() < 0;
    }

    deriveQualityFromSellIn() {
        if (!this.hasExpirationDatePassed()) {
            return this;
        }

        let shoppingArticle = this;

        shoppingArticle = shoppingArticle.chainQualityAmendments(
            q => {
                if (
                    this.isReferencedUnderTheName(ItemName.agedBrie) &&
                    QualityAssurance.isShoppingArticleBelowTheQualityStandard(shoppingArticle)
                ) {
                    return q + 1;
                }

                return q
            },
        );

        shoppingArticle = shoppingArticle.chainQualityAmendments(_ => {
            if (this.isReferencedUnderTheName(ItemName.backstagePasses)) {
                return 0
            }

            return _;
        });

        if (shoppingArticle.hasSomeQualityLeft()) {
            return shoppingArticle.chainQualityAmendments(q => {
                if (
                    this.hasSomeQualityLeft() &&
                    this.isNotReferencedUnderTheName(ItemName.sulfurasHandOfRagnaros)
                ) {
                    return q - 1;
                }

                return q;
            });
        }

        return shoppingArticle;
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

        if (this.isSulfurasItem()) {
            throw 'Can not amend sellIn of "Sulfuras" items.'
        }

        this.item = new Item(
            this.name(),
            sellIn,
            this.quality()
        );

        return new ShoppingArticle(this.item);
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