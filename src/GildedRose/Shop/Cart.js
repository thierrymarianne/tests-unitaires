
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

    articles() {
        return this.shoppingArticles;
    }
}

module.exports = Cart;
