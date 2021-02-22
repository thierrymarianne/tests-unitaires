
const ShoppingArticle = require('./ShoppingArticle');

class Cart {
    constructor(shoppingArticles = []) {
        this.shoppingArticles = shoppingArticles.map((a, index) => {
            if (!(a instanceof ShoppingArticle)) {
                throw `Invalid shopping article at index #${index}`
            }

            return a;
        })
    }

    assessQuality() {
        return this.shoppingArticles.map(shoppingArticle =>
            shoppingArticle.assessQualityAtTheEndOfTheDay().unwrapItem()
        );
    }
}

module.exports = Cart;
