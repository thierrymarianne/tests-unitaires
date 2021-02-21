const {Shop} = require('../../src/GildedRose/Shop');
const {Item, ItemType} = require('../../src/GildedRose/Item');
const {QualityAssurance} = require('../../src/GildedRose');

describe('how a shop assesses the quality of its items',
    () => {
        it(
            'preserves the names of items in a shop.',
            () => {
                const items = [
                    new Item(ItemType.dexterityVest, 10, 20),
                    new Item(ItemType.agedBrie, 2, 0),
                    new Item(ItemType.elixirOfTheMongose, 5, 7),
                    new Item(ItemType.sulfurasHandOfRagnaros, 0, 80),
                    new Item(ItemType.sulfurasHandOfRagnaros, -1, 80),
                    new Item(ItemType.backstagePasses, 15, 20),
                    new Item(ItemType.backstagePasses, 10, 49),
                    new Item(ItemType.backstagePasses, 5, 49),
                    // this conjured item does not work properly yet
                    new Item(ItemType.conjuredManaCake, 3, 6)
                ];

                const gildedRose = new Shop(items);
                const updatedItems = gildedRose.updateQuality();

                expect(updatedItems[0].name).toBe(ItemType.dexterityVest);
                expect(updatedItems[1].name).toBe(ItemType.agedBrie);
                expect(updatedItems[2].name).toBe(ItemType.elixirOfTheMongose);
                expect(updatedItems[3].name).toBe(ItemType.sulfurasHandOfRagnaros);
                expect(updatedItems[4].name).toBe(ItemType.sulfurasHandOfRagnaros);
                expect(updatedItems[5].name).toBe(ItemType.backstagePasses);
                expect(updatedItems[6].name).toBe(ItemType.backstagePasses);
                expect(updatedItems[7].name).toBe(ItemType.backstagePasses);
                expect(updatedItems[8].name).toBe(ItemType.conjuredManaCake);
            }
        );

        it(
            'decreases the sellIns of items in a shop except for sulfuras.',
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

                const items = [
                    new Item(ItemType.dexterityVest, 10, 20),
                    new Item(ItemType.agedBrie, 2, 0),
                    new Item(ItemType.elixirOfTheMongose, 5, 7),
                    new Item(ItemType.backstagePasses, 15, 20),
                    new Item(ItemType.backstagePasses, 10, 49),
                    new Item(ItemType.backstagePasses, 5, 49),
                    new Item(ItemType.conjuredManaCake, 3, 6)
                ];

                const gildedRose = new Shop(items);
                const updatedItems = gildedRose.updateQuality();

                expect(updatedItems[0].sellIn).toBe(sellIns[0] - 1);
                expect(updatedItems[1].sellIn).toBe(sellIns[1] - 1);
                expect(updatedItems[2].sellIn).toBe(sellIns[2] - 1);
                expect(updatedItems[3].sellIn).toBe(sellIns[3] - 1);
                expect(updatedItems[4].sellIn).toBe(sellIns[4] - 1);
                expect(updatedItems[5].sellIn).toBe(sellIns[5] - 1);
                expect(updatedItems[6].sellIn).toBe(sellIns[6] - 1);
            }
        );

        it(
            'does not decrease the sellIns of sulfuras items.',
            () => {
                const sellIns = [
                    0,
                    -1,
                ];

                const items = [
                    new Item(ItemType.sulfurasHandOfRagnaros, 0, 80),
                    new Item(ItemType.sulfurasHandOfRagnaros, -1, 80),
                ];

                const gildedRose = new Shop(items);
                const updatedItems = gildedRose.updateQuality();

                expect(updatedItems[0].sellIn).toBe(sellIns[0]);
                expect(updatedItems[1].sellIn).toBe(sellIns[1]);
            }
        );

        it(
            'decreases the quality of items.',
            () => {
                const quality = [
                    20,
                    7,
                    6
                ];

                const items = [
                    new Item(ItemType.dexterityVest, 10, 20),
                    new Item(ItemType.elixirOfTheMongose, 5, 7),
                    new Item(ItemType.conjuredManaCake, 3, 6)
                ];

                const gildedRose = new Shop(items);
                const updatedItems = gildedRose.updateQuality();

                expect(updatedItems[0].quality).toBe(quality[0] - 1);
                expect(updatedItems[1].quality).toBe(quality[1] - 1);
                expect(updatedItems[2].quality).toBe(quality[2] - 1);
            }
        );

        it(
            'decreases the quality of items twice as fast as soon as they\'ve started to be stale.',
            () => {
                const quality = [
                    3,
                    2,
                    0
                ];

                const passedSellIn = 0

                const items = [
                    new Item(ItemType.dexterityVest, passedSellIn, quality[0]),
                    new Item(ItemType.elixirOfTheMongose, passedSellIn, quality[1]),
                    new Item(ItemType.conjuredManaCake, passedSellIn, quality[2])
                ];

                const gildedRose = new Shop(items);
                const updatedItems = gildedRose.updateQuality();

                expect(updatedItems[0].quality).toBe(quality[0] - 2);
                expect(updatedItems[1].quality).toBe(quality[1] - 2);
                expect(updatedItems[2].quality).toBe(Math.max(quality[2] - 2, 0));
            }
        );

        it(
            'preserves the quality of sulfuras items over time at the same level.',
            () => {
                const sellIns = [
                    0,
                    -1,
                ];

                const sulfuraQuality = Item.SULFURA_QUALITY;

                const items = [
                    new Item(ItemType.sulfurasHandOfRagnaros, sellIns[0], sulfuraQuality),
                    new Item(ItemType.sulfurasHandOfRagnaros, sellIns[1], sulfuraQuality),
                ];

                const gildedRose = new Shop(items);
                const updatedItems = gildedRose.updateQuality();

                expect(updatedItems[0].quality).toBe(sulfuraQuality);
                expect(updatedItems[1].quality).toBe(sulfuraQuality);
            }
        );

        it(
            'increases the quality of aged brie over time.',
            () => {
                const qualities = [
                    {startsAt: 0, eventuallyAssessedAt: 1},
                    {startsAt: 30, eventuallyAssessedAt: 31},
                    {startsAt: QualityAssurance.MAX_QUALITY, eventuallyAssessedAt: QualityAssurance.MAX_QUALITY},
                ];

                qualities.forEach((q) => {
                    const items = [
                        new Item(ItemType.agedBrie, 2, q.startsAt),
                    ];

                    const gildedRose = new Shop(items);
                    const updatedItems = gildedRose.updateQuality();

                    expect(updatedItems[0].quality).toBe(q.eventuallyAssessedAt);
                });
            }
        );

        it(
            'increases the quality of backstage passes over time.',
            () => {
                const quality = [
                    [
                        {startsAt: 20, eventuallyAssessedAt: 21},
                        {startsAt: 49, eventuallyAssessedAt: 50},
                        {startsAt: 49, eventuallyAssessedAt: 50},
                    ],
                    [
                        {startsAt: 0, eventuallyAssessedAt: 1},
                        {startsAt: 49, eventuallyAssessedAt: 50},
                        {startsAt: QualityAssurance.MAX_QUALITY, eventuallyAssessedAt: QualityAssurance.MAX_QUALITY}
                    ]
                ];

                quality.forEach((q) => {
                    const items = [
                        new Item(ItemType.backstagePasses, 15, q[0].startsAt),
                        new Item(ItemType.backstagePasses, 10, q[1].startsAt),
                        new Item(ItemType.backstagePasses, 5, q[2].startsAt),
                    ];

                    const gildedRose = new Shop(items);
                    const updatedItems = gildedRose.updateQuality();

                    expect(updatedItems[0].quality)
                    .toBe(q[0].eventuallyAssessedAt);

                    expect(updatedItems[1].quality)
                    .toBe(q[1].eventuallyAssessedAt);

                    expect(updatedItems[2].quality)
                    .toBe(q[2].eventuallyAssessedAt);
                })
            }
        );

        it(
            'voids the quality of backstage passes as soon as the concert is over.',
            () => {
                const quality = [
                    40,
                ];

                const sellIn = [
                    -1,
                ];

                const items = [
                    new Item(ItemType.backstagePasses, sellIn[0], quality[0]),
                ];

                const gildedRose = new Shop(items);
                const updatedItems = gildedRose.updateQuality();

                expect(updatedItems[0].quality).toBe(0);
            }
        );

        it(
            'factors in the sellIn when increasing the quality of backstage passes.',
            () => {
                const quality = [
                    10,
                    10
                ];

                const sellIn = [
                    10,
                    5,
                ];

                const items = [
                    new Item(ItemType.backstagePasses, sellIn[0], quality[0]),
                    new Item(ItemType.backstagePasses, sellIn[1], quality[1]),
                ];

                const gildedRose = new Shop(items);
                const updatedItems = gildedRose.updateQuality();

                expect(updatedItems[0].quality).toBe(quality[0] + 2);
                expect(updatedItems[1].quality).toBe(quality[1] + 3);
            }
        );
    }
);

