
const ShoppingArticle = require('./ShoppingArticle');

class Cart {
    constructor(shoppingArticles = []) {
        this.articles = shoppingArticles.map((a, index) => {
            if (!(a instanceof ShoppingArticle)) {
                throw `Invalid shopping article at index #${index}`
            }
        })
    }

    articles() {
        return this.articles;
    }
}

module.exports = Cart;
