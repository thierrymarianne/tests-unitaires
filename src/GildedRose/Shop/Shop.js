const Cart = require('./Cart');
const ShoppingArticle = require('./ShoppingArticle');

const {ItemName} = require('../Item');
const {QualityAssurance} = require('../../GildedRose');

class Shop {
    constructor(items = []) {
        this.cart = new Cart(items.map(i => ShoppingArticle.from(i)));
        this.items = items;
    }

    assessQualityOfShoppingArticlesInCart() {
        const items = [];

        for (let i = 0; i < this.cart.articles().length; i++) {
            const article = ((n) => {
                let shoppingArticle = this.cart.nthShoppingArticle(n);

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
                            shoppingArticle.sellIn() < 11
                        ) {
                            return q + 1;
                        }

                        return q;
                    },
                    q => {
                        if (
                            shoppingArticle.isReferencedUnderTheName(ItemName.backstagePasses) &&
                            QualityAssurance.isShoppingArticleBelowTheQualityStandard(shoppingArticle) &&
                            shoppingArticle.sellIn() < 6
                        ) {
                            return q + 1;
                        }

                        return q;
                    }
                ).deriveQualityFromSellIn();
            })(i);

            items.push(article.unwrapItem());
        }

        this.items = items;

        return this.items;
    }

    assessQualityOfItems() {
        for (let i = 0; i < this.items.length; i++) {
            if (
                this.items[i].name !== ItemName.agedBrie &&
                this.items[i].name !== ItemName.backstagePasses
            ) {
                if (this.items[i].quality > 0) {
                    if (this.items[i].name !== ItemName.sulfurasHandOfRagnaros) {
                        this.items[i].quality = this.items[i].quality - 1;
                    }
                }
            } else {
                if (this.items[i].quality < QualityAssurance.MAX_QUALITY) {
                    this.items[i].quality = this.items[i].quality + 1;
                    if (
                        this.items[i].name === ItemName.backstagePasses
                    ) {
                        if (this.items[i].sellIn < 11) {
                            if (this.items[i].quality < QualityAssurance.MAX_QUALITY) {
                                this.items[i].quality = this.items[i].quality + 1;
                            }
                        }
                        if (this.items[i].sellIn < 6) {
                            if (this.items[i].quality < QualityAssurance.MAX_QUALITY) {
                                this.items[i].quality = this.items[i].quality + 1;
                            }
                        }
                    }
                }
            }

            if (this.items[i].name !== ItemName.sulfurasHandOfRagnaros) {
                this.items[i].sellIn = this.items[i].sellIn - 1;
            }

            if (this.items[i].sellIn < 0) {
                if (this.items[i].name !== ItemName.agedBrie) {
                    if (
                        this.items[i].name !== ItemName.backstagePasses
                    ) {
                        if (this.items[i].quality > 0) {
                            if (this.items[i].name !== ItemName.sulfurasHandOfRagnaros) {
                                this.items[i].quality = this.items[i].quality - 1;
                            }
                        }
                    } else {
                        this.items[i].quality = 0;
                    }
                } else {
                    if (this.items[i].quality < QualityAssurance.MAX_QUALITY) {
                        this.items[i].quality = this.items[i].quality + 1;
                    }
                }
            }
        }

        return this.items;
    }

    updateQuality() {
        return this.assessQualityOfShoppingArticlesInCart()
    }
}

module.exports = Shop;
