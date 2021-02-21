const {Item, ItemType} = require('../../src/GildedRose/Item');
const {QualityAssurance} = require('../../src/GildedRose');

describe('Quality assurance', () => {
    it(
        'warrants the acceptable quality of items.',
        () => {
            expect(QualityAssurance.isOfAcceptableQuality(
                new Item(ItemType.agedBrie)
            )).toBe(false);

            let quality = -1;
            expect(QualityAssurance.isOfAcceptableQuality(
                new Item(ItemType.agedBrie, 1, quality)
            )).toBe(false);

            quality = 0;
            expect(QualityAssurance.isOfAcceptableQuality(
                new Item(ItemType.agedBrie, 1, quality)
            )).toBe(true);
        }
    );
});