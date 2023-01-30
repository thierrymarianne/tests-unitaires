<?php

declare(strict_types=1);

namespace Tests;

use GildedRose\GildedRose;
use GildedRose\Item;
use PHPUnit\Framework\TestCase;

class GildedRoseTest extends TestCase
{
    public function testGildedRoseItemsQuality(): void
    {
        $quality = 10;
        $item = new Item('Article en drop shipping', 8, $quality);
        (new GildedRose([$item]))->updateQuality();
        self::assertEquals(10 - 2, $item->quality);
    }
}
