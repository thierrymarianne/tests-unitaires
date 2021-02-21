const { Item, Shop } = require("../../src/GildedRose");

describe("Gilded Rose", function () {
  it("should foo", function () {
    const dexterityVest  = "+5 Dexterity Vest";
    const agedBrie  = "Aged Brie";
    const elixirOfTheMongose  = "Elixir of the Mongoose";
    const sulfurasHandOfRagnaros  = "Sulfuras, Hand of Ragnaros";
    const backstagePasses = "Backstage passes to a TAFKAL80ETC concert";
    const conjuredManaCake = "Conjured Mana Cake";

    const items = [
      new Item(dexterityVest, 10, 20),
      new Item(agedBrie, 2, 0),
      new Item(elixirOfTheMongose, 5, 7),
      new Item(sulfurasHandOfRagnaros, 0, 80),
      new Item(sulfurasHandOfRagnaros, -1, 80),
      new Item(backstagePasses, 15, 20),
      new Item(backstagePasses, 10, 49),
      new Item(backstagePasses, 5, 49),
      // this conjured item does not work properly yet
      new Item(conjuredManaCake, 3, 6)
    ];

    const gildedRose = new Shop(items);
    const updatedItems = gildedRose.updateQuality();

    expect(updatedItems[0].name).toBe(dexterityVest);
    expect(updatedItems[1].name).toBe(agedBrie);
    expect(updatedItems[2].name).toBe(elixirOfTheMongose);
    expect(updatedItems[3].name).toBe(sulfurasHandOfRagnaros);
    expect(updatedItems[4].name).toBe(sulfurasHandOfRagnaros);
    expect(updatedItems[5].name).toBe(backstagePasses);
    expect(updatedItems[6].name).toBe(backstagePasses);
    expect(updatedItems[7].name).toBe(backstagePasses);
    expect(updatedItems[8].name).toBe(conjuredManaCake);
  });
});
