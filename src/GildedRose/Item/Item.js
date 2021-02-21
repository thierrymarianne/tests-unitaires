class Item {
    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }

    updateQuality() {
        // TODO
    }
}

Item.SULFURA_QUALITY = 80;
Item.TYPES = {
    dexterityVest: '+5 Dexterity Vest',
    agedBrie: 'Aged Brie',
    elixirOfTheMongose: 'Elixir of the Mongoose',
    sulfurasHandOfRagnaros: 'Sulfuras, Hand of Ragnaros',
    backstagePasses: 'Backstage passes to a TAFKAL80ETC concert',
    conjuredManaCake: 'Conjured Mana Cake',
};

module.exports = Item;
