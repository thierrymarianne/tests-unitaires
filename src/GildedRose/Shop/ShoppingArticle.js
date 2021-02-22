
const {Item, ItemName} = require('../Item');
const {QualityAssurance} = require('../../GildedRose');

const BACKSTAGE_PASSES_QUALITY_10_DAYS_LEFT = 10
const BACKSTAGE_PASSES_QUALITY_5_DAYS_LEFT = 5

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

    belongsToCategoryOfArticlesWhichQualityDecreasesOverTime() {
        return !this.belongsToCategoryOfArticlesWhichQualityCanIncreaseOverTime();
    }

    sellIn() {
        return this.item.sellIn;
    }

    hasExpirationDatePassed() {
        return this.sellIn() < 0;
    }

    assessQualityAtTheEndOfTheDay() {
        const shoppingArticle = this;

        if (shoppingArticle.belongsToCategoryOfArticlesWhichQualityDecreasesOverTime()) {
            return shoppingArticle.chainQualityAmendments(
                q => {
                    if (
                        shoppingArticle.hasSomeQualityLeft() &&
                        shoppingArticle.isNotReferencedUnderTheName(ItemName.sulfurasHandOfRagnaros)
                    ) {
                        return q - 1;
                    }

                    return q;
                },
                q => {
                    if (
                        shoppingArticle.hasSomeQualityLeft() &&
                        shoppingArticle.isReferencedUnderTheName(ItemName.conjuredManaCake)
                    ) {
                        return q - 1;
                    }

                    return q;
                }
            ).deriveQualityFromSellIn()
        }

        if (QualityAssurance.hasShoppingArticleMetTheQualityStandard(shoppingArticle)) {
            return shoppingArticle;
        }

        return shoppingArticle.chainQualityAmendments(
            q => q + 1,
            q => {
                if (
                    shoppingArticle.isReferencedUnderTheName(ItemName.backstagePasses) &&
                    QualityAssurance.isShoppingArticleBelowTheQualityStandard(shoppingArticle) &&
                    shoppingArticle.sellIn() <= BACKSTAGE_PASSES_QUALITY_10_DAYS_LEFT
                ) {
                    return q + 1;
                }

                return q;
            },
            q => {
                if (
                    shoppingArticle.isReferencedUnderTheName(ItemName.backstagePasses) &&
                    QualityAssurance.isShoppingArticleBelowTheQualityStandard(shoppingArticle) &&
                    shoppingArticle.sellIn() <= BACKSTAGE_PASSES_QUALITY_5_DAYS_LEFT
                ) {
                    return q + 1;
                }

                return q;
            }
        ).deriveQualityFromSellIn();
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

        // Quality Amendments applied for shopping articles
        // having a passed expiration date

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
            },
            q => {
                if (
                    shoppingArticle.hasSomeQualityLeft() &&
                    shoppingArticle.isReferencedUnderTheName(ItemName.conjuredManaCake)
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