
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

    nthShoppingArticle(n) {
        if (typeof this.shoppingArticles[n] === 'undefined') {
            throw `Can not find nth article with n being equal to ${n}`;
        }

        return this.shoppingArticles[n];
    }
}

module.exports = Cart;
