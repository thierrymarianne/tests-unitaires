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
    }
);
