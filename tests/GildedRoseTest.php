<?php

declare(strict_types=1);

namespace Tests;

use GildedRose\Item;
use PHPUnit\Framework\TestCase;

class GildedRoseTest extends TestCase
{
    public function testArticle(): void
    {
        $article = new Item('Article', 1, 1);
    }
}
