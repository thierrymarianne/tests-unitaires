
const {Item, ItemName} = require('../src/GildedRose/Item');
const {Cart, ShoppingArticle} = require('../src/GildedRose/Shop');
const {QualityAssurance} = require('../src/GildedRose');

describe('Quality assurance', () => {
    it(
        'warrants the quality of items.',
        () => {
            expect(QualityAssurance.isOfAcceptableQuality(
                new Item(ItemName.agedBrie)
            )).toBe(false);

            let quality = -1;
            expect(QualityAssurance.isOfAcceptableQuality(
                new Item(ItemName.agedBrie, 1, quality)
            )).toBe(false);

            quality = 0;
            expect(QualityAssurance.isOfAcceptableQuality(
                new Item(ItemName.agedBrie, 1, quality)
            )).toBe(true);
        }
    );

    it (
        'preserves names and sellIns of items wrapped by Shopping articles',
        () => {
            const sellIns = [
                10,
                2,
                5,
                15,
                10,
                5,
                3
            ];

            const cart = new Cart([
                ShoppingArticle.from(new Item(ItemName.dexterityVest, sellIns[0], 20)),
                ShoppingArticle.from(new Item(ItemName.agedBrie, sellIns[1], 0)),
                ShoppingArticle.from(new Item(ItemName.elixirOfTheMongose, sellIns[2], 7)),
                ShoppingArticle.from(new Item(ItemName.backstagePasses, sellIns[3], 20)),
                ShoppingArticle.from(new Item(ItemName.backstagePasses, sellIns[4], 49)),
                ShoppingArticle.from(new Item(ItemName.backstagePasses, sellIns[5], 49)),
                ShoppingArticle.from(new Item(ItemName.conjuredManaCake, sellIns[6], 6))
            ]);

            const items = cart.postQualityAssessementItems();

            expect(items[0].name).toBe(ItemName.dexterityVest);
            expect(items[1].name).toBe(ItemName.agedBrie);
            expect(items[2].name).toBe(ItemName.elixirOfTheMongose);
            expect(items[3].name).toBe(ItemName.backstagePasses);
            expect(items[4].name).toBe(ItemName.backstagePasses);
            expect(items[5].name).toBe(ItemName.backstagePasses);
            expect(items[6].name).toBe(ItemName.conjuredManaCake);

            expect(items[0].sellIn).toBe(sellIns[0] - 1);
            expect(items[1].sellIn).toBe(sellIns[1] - 1);
            expect(items[2].sellIn).toBe(sellIns[2] - 1);
            expect(items[3].sellIn).toBe(sellIns[3] - 1);
            expect(items[4].sellIn).toBe(sellIns[4] - 1);
            expect(items[5].sellIn).toBe(sellIns[5] - 1);
            expect(items[6].sellIn).toBe(sellIns[6] - 1);
        }
    );

    it (
        'assesses the quality of items wrapped by Shopping articles',
        () => {
            const sellIns = [
                0,
                -1,
            ];

            const sulfuraQuality = Item.SULFURA_QUALITY;

            let cart = new Cart([
                ShoppingArticle.from(
                    new Item(ItemName.sulfurasHandOfRagnaros, sellIns[0], sulfuraQuality)
                ),
                ShoppingArticle.from(
                    new Item(ItemName.sulfurasHandOfRagnaros, sellIns[0], sulfuraQuality)
                ),
            ]);

            let items = cart.postQualityAssessementItems();

            expect(items[0].quality).toBe(sulfuraQuality);
            expect(items[1].quality).toBe(sulfuraQuality);

            const quality = [
                20,
                7,
                7,
                6,
                4
            ];

            cart = new Cart([
                ShoppingArticle.from(
                    new Item(ItemName.dexterityVest, 10, quality[0])
                ),
                ShoppingArticle.from(
                    new Item(ItemName.elixirOfTheMongose, 5, quality[1])
                ),
                ShoppingArticle.from(
                    new Item(ItemName.elixirOfTheMongose, -1, quality[2])
                ),
                ShoppingArticle.from(
                    new Item(ItemName.conjuredManaCake, 3, quality[3])
                ),
                ShoppingArticle.from(
                    new Item(ItemName.conjuredManaCake, 0, quality[4])
                )
            ]);

            items = cart.postQualityAssessementItems();

            expect(items[0].quality).toBe(quality[0] - 1);
            expect(items[1].quality).toBe(quality[1] - 1);
            expect(items[2].quality).toBe(quality[2] - 2);
            expect(items[3].quality).toBe(quality[3] - 2);
            expect(items[4].quality).toBe(quality[4] - 4);
        }
    );
});