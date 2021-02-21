const {Item, ItemName} = require('../../src/GildedRose/Item');
const {QualityAssurance} = require('../../src/GildedRose');

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
});