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

        this.cart.articles().map(shoppingArticle => {
            const article = (() => {
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
            })();

            items.push(article.unwrapItem());
        });

        this.items = items;

        return this.items;
    }

    updateQuality() {
        return this.assessQualityOfShoppingArticlesInCart()
    }
}

module.exports = Shop;
