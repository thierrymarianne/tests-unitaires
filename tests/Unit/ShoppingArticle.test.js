const {Item, ItemType} = require('../../src/GildedRose/Item');
const {ShoppingArticle} = require('../../src/GildedRose/Shop');

describe('Shopping article', () => {
    it(
        'fails at wrapping something different from an item.',
        () => {
            expect(() => {
                ShoppingArticle.from(
                    null
                );
            }).toThrow('An instance of Item is required.')
        }
    );

    it(
        'fails at wrapping an item of non-acceptable quality.',
        () => {
            expect(() => {
                ShoppingArticle.from(
                    new Item('Item having defects', 0, -1)
                );
            }).toThrow('Item\'s quality is not good enough.')
        }
    );

    it(
        'exposes the quality, sellIn and name of an item available in a shop.',
        () => {
            const sellIn = 1;
            const quality = 2;
            const name = ItemType.agedBrie;

            const article = ShoppingArticle.from(
                new Item(name, sellIn, quality)
            );

            expect(article.name()).toBe(name);
            expect(article.quality()).toBe(quality);
            expect(article.sellIn()).toBe(sellIn);
        }
    );
});