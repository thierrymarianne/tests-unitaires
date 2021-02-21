const {QualityAssurance, Item} = require('../../src/GildedRose');

describe('Quality assurance', () => {
    it(
        'warrants the acceptable quality of items.',
        () => {
            expect(QualityAssurance.isOfAcceptableQuality(
                new Item(Item.TYPES.agedBrie)
            )).toBe(false);

            let quality = -1;
            expect(QualityAssurance.isOfAcceptableQuality(
                new Item(Item.TYPES.agedBrie, 1, quality)
            )).toBe(false);

            quality = 0;
            expect(QualityAssurance.isOfAcceptableQuality(
                new Item(Item.TYPES.agedBrie, 1, quality)
            )).toBe(true);
        }
    );
});