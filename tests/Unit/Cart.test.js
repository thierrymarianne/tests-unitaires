
const {Item, ItemName} = require('../../src/GildedRose/Item');
const {Cart, ShoppingArticle} = require('../../src/GildedRose/Shop');

describe(
    'Cart',
    () => {
        it(
            'can not contain something different from shopping articles.',
            () => {
                expect(() => {
                    new Cart([
                        new ShoppingArticle(
                            new Item(ItemName.agedBrie, 1, 2),
                        ),
                        new ShoppingArticle(
                            new Item(ItemName.sulfurasHandOfRagnaros, 15, 50),
                        ),
                        null,
                        new ShoppingArticle(
                            new Item(ItemName.backstagePasses, 4, 50),
                        ),
                        new ShoppingArticle(
                            new Item(ItemName.dexterityVest, 3, 50),
                        )
                    ])
                }).toThrow('Invalid shopping article at index #2');
            }
        );

        it(
            'exposes shopping articles reflecting picked items.',
            () => {
                const cart = new Cart([
                    new ShoppingArticle(
                        new Item(ItemName.agedBrie, 1, 2),
                    ),
                    new ShoppingArticle(
                        new Item(ItemName.sulfurasHandOfRagnaros, 15, 50),
                    ),
                    new ShoppingArticle(
                        new Item(ItemName.backstagePasses, 4, 30),
                    ),
                    new ShoppingArticle(
                        new Item(ItemName.dexterityVest, 3, 20),
                    )
                ]);

                const cartArticles = cart.articles();

                expect(cartArticles.length).toBe(4);

                expect(cartArticles[0].name()).toBe(ItemName.agedBrie);
                expect(cartArticles[0].sellIn()).toBe(1);
                expect(cartArticles[0].quality()).toBe(2);

                expect(cartArticles[1].name()).toBe(ItemName.sulfurasHandOfRagnaros);
                expect(cartArticles[1].sellIn()).toBe(15);
                expect(cartArticles[1].quality()).toBe(50);

                expect(cartArticles[2].name()).toBe(ItemName.backstagePasses);
                expect(cartArticles[2].sellIn()).toBe(4);
                expect(cartArticles[2].quality()).toBe(30);

                expect(cartArticles[3].name()).toBe(ItemName.dexterityVest);
                expect(cartArticles[3].sellIn()).toBe(3);
                expect(cartArticles[3].quality()).toBe(20);
            }
        );
    }
);
