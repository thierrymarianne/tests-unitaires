
const {Item, ItemName} = require('../../src/GildedRose/Item');
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
                    new Item(ItemName.sulfurasHandOfRagnaros, 0, -1)
                );
            }).toThrow('Item\'s quality is not good enough.')
        }
    );

    it(
        'fails at wrapping an unknown item.',
        () => {
            const itemName = 'Unknown item name';

            expect(() => {
                ShoppingArticle.from(
                    new Item(itemName, 0, 0)
                );
            }).toThrow(`Can not find item in shop by name: "${itemName}"`)
        }
    );

    it(
        'exposes the quality, sellIn and name of an item available in a shop.',
        () => {
            const sellIn = 1;
            const quality = 2;
            const name = ItemName.agedBrie;

            const article = ShoppingArticle.from(
                new Item(name, sellIn, quality)
            );

            expect(article.name()).toBe(name);
            expect(article.quality()).toBe(quality);
            expect(article.sellIn()).toBe(sellIn);
        }
    );

    it(
        'prevents the quality of "Sulfuras" items from being wrongfully declared.',
        () => {

            expect(() => {
                const sellIn = 1;
                const invalidQuality = 2;
                const name = ItemName.sulfurasHandOfRagnaros;

                ShoppingArticle.from(
                    new Item(name, sellIn, invalidQuality)
                );
            }).toThrow('Quality of "Sulfuras, Hand of Ragnaros" items has to be compliant with a standard of 80.');
        }
    );
});