<?php

declare(strict_types=1);

namespace Tests;

use GildedRose\GildedRose;
use GildedRose\Item;
use PHPUnit\Framework\TestCase;

class GildedRoseTest extends TestCase
{
    public function testItemNameProperty()
    {
        $article = new Item('ArticleBanal', 1, 2);

        // On s'assure ici que la valeur de la propriété
        // `name` de notre article est celle qu'on attend
        self::assertSame('ArticleBanal', $article->name);
    }

    public function testItemNamePropertyIsAString()
    {
        $article = new Item('ArticleBanal', 1, 2);

        // La dénomination d'un article est bien une chaîne de caractères
        self::assertIsString($article->name);
    }

    public function testItemSellInProperty()
    {
        $article = new Item('ArticleBanal', 1, 2);

        // On s'assure ici que la valeur de la propriété
        // `sellIn` de notre article est celle qu'on attend
        self::assertSame(1, $article->sellIn);
    }

    public function testQualityLoss()
    {
        $item = new Item('ArticleBanal', 2, 1);

        self::assertEquals(1, $item->quality,
            'ArticleBanal possède une qualité de 1 au départ'
        );

        $shop = new GildedRose([$item]);
        $shop->updateQuality();

        self::assertEquals(0, $item->quality,
            'ArticleBanal possède une qualité de 0 après un jour'
        );
    }

    public function testChairQuality()
    {
        $item = new Item('Chaise en plastique', 2, 80);

        self::assertEquals(80, $item->quality,
            'Chaise en plastique possède une qualité de 80 au départ'
        );

        $shop = new GildedRose([$item]);
        $shop->updateQuality();

        self::assertEquals(80, $item->quality,
            'Chaise en plastique possède une qualité de 80, 2 jours plus tard'
        );
    }

    public function testGildedRoseItemsQualityMax(): void
    {
        // Notre article banal possède une qualité de 2,
        // qui diminue avec le temps
        $item = new Item('ArticleBanal', 200, 2);

        for ($i = 0 ; $i < 100 ; $i++) {
            $shop = new GildedRose([$item]);
            $shop->updateQuality();

            self::assertLessThanOrEqual(50, $item->quality);
        }
    }

    public function testGildedRoseItemsQualityOops(): void
    {
        // Notre article banal possède une qualité de 51,
        // ce qui est contraire à l'une des règles
        $item = new Item('ArticleBanal', 200, 51);

        for ($i = 0 ; $i < 100 ; $i++) {
            $shop = new GildedRose([$item]);
            $shop->updateQuality();

            self::assertLessThanOrEqual(50, $item->quality);
        }
    }

    public function testInvalidQualityException(): void
    {
        try {
            new Item('ArticleBanal', 200, 51); // contraire à l'une des règles
        } catch (\Exception $exception) {
            self::assertInstanceOf(\InvalidArgumentException::class, $exception);
            return;
        }

        // Le test échouera quand aucune exception est levée.
        $this->fail(
            'Un article distinct de Chaise en plastique a une qualité max de 50'
        );
    }

    public function testCheeseQualityGain(): void
    {
        $brie = new Item('Brie Vieilli', 200, 3);
        (new GildedRose([$brie]))->updateQuality();
        self::assertEquals(4, $brie->quality);

        (new GildedRose([$brie]))->updateQuality();
        self::assertEquals(5, $brie->quality);
    }

    public function testItemsQualityIsNeverLessThan0(): void
    {
        // Notre article banal possède une qualité de 2,
        // qui diminue avec le temps
        $item = new Item('ArticleBanal', 200, 2);

        for ($i = 0 ; $i < 100 ; $i++) {
            $shop = new GildedRose([$item]);
            $shop->updateQuality();

            self::assertGreaterThanOrEqual(0, $item->quality);
        }
    }

    public function testConcertTicketQualityLessThan10Days(): void
    {
        $quality = 1;
        $item = new Item('Ticket de concert', 20, $quality);

        for ($i = 0 ; $i < 11 ; $i++) {
            (new GildedRose([$item]))->updateQuality();
            $quality = $item->sellIn < 10 ? $quality + 2 : $quality + 1;
            self::assertEquals($quality, $item->quality);
        }
    }

    public function testConcertTicketQualityLessThan5Days(): void
    {
        $quality = 1;
        $item = new Item('Ticket de concert', 8, $quality);
        for ($i = 0 ; $i < 20 ; $i++) {
            (new GildedRose([$item]))->updateQuality();
            if ($item->sellIn >= 0) {
                $quality = $item->sellIn < 5 ? $quality + 3 : $quality + 2;
            } else {
                $quality = 0;
            }
            self::assertEquals($quality, $item->quality);
        }
    }

    public function testGildedRoseDropShoppingItemsQuality(): void
    {
        $quality = 10;
        $item = new Item('Article en drop shipping', 8, $quality);
        (new GildedRose([$item]))->updateQuality();
        self::assertEquals(10 - 2, $item->quality);
    }
}
