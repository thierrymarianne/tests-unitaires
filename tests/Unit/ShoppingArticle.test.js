
const {Item, ItemName} = require('../../src/GildedRose/Item');
const {ShoppingArticle} = require('../../src/GildedRose/Shop');
const {QualityAssurance} = require('../../src/GildedRose');

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
        'unwraps an underlying Shop item',
        () => {
            const sellIn = 1;
            const quality = 2;
            const name = ItemName.agedBrie;

            const shopItem = new Item(name, sellIn, quality)

            const shoppingArticle = ShoppingArticle.from(
                new Item(name, sellIn, quality)
            );

            expect(shoppingArticle.unwrapItem()).toEqual(shopItem);
        }
    )

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

    it(
        'can not amend quality of "Sulfuras" shopping article with a value different from its standard quality value.',
        () => {
            const sellIn = 1;
            const quality = QualityAssurance.STANDARD_QUALITY[ItemName.sulfurasHandOfRagnaros];
            const name = ItemName.sulfurasHandOfRagnaros;

            expect(() => ShoppingArticle.from(
                new Item(name, sellIn, quality)
            ).amendQuality(30))
                .toThrow('Quality of "Sulfuras, Hand of Ragnaros" items has to be compliant with a standard of 80.');
        }
    );

    it(
        'amends sellIn.',
        () => {
                const sellIn = 1;
                const quality = 10;
                const name = ItemName.dexterityVest;

                const article = ShoppingArticle.from(
                    new Item(name, sellIn, quality)
                ).amendSellIn(0);

                expect(article.sellIn()).toBe(0);
        }
    );

    it(
        'can not amend sellIn consistently with time.',
        () => {
                const sellIn = 1;
                const quality = 20;
                const name = ItemName.dexterityVest;

                expect(() => ShoppingArticle.from(
                    new Item(name, sellIn, quality)
                ).amendSellIn(2))
                .toThrow('Can not amend sellIn (inconsistent order)');
        }
    );

    it(
        'can not amend sellIn of "Sulfuras" items with time.',
        () => {
            const sellIn = 1;
            const quality = QualityAssurance.STANDARD_QUALITY[ItemName.sulfurasHandOfRagnaros];
            const name = ItemName.sulfurasHandOfRagnaros;

            expect(() => ShoppingArticle.from(
                new Item(name, sellIn, quality)
            ).amendSellIn(0))
                .toThrow('Can not amend sellIn of "Sulfuras" items.');
        }
    );

    it(
        'can not amend quality with negative value.',
        () => {
            const sellIn = 1;
            const quality = 30;
            const name = ItemName.agedBrie;

            expect(() => ShoppingArticle.from(
                new Item(name, sellIn, quality)
            ).amendQuality(-1))
            .toThrow('Quality can not be negative');
        }
    );

    it(
        'can not amend quality with a value above the quality threshold.',
        () => {
            const sellIn = 1;
            const quality = QualityAssurance.STANDARD_QUALITY[ItemName.sulfurasHandOfRagnaros];
            const name = ItemName.agedBrie;

            expect(() => ShoppingArticle.from(
                new Item(name, sellIn, quality)
            ).amendQuality(51))
            .toThrow('Quality can not be greater than 50.');
        }
    );
});