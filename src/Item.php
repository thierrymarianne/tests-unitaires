<?php

declare(strict_types=1);

namespace GildedRose;

final class Item implements \Stringable
{
    public function __construct(public string $name, public int $sellIn, public int $quality) {
//        if ($name !== 'Chaise en plastique' && $quality > 50) {
//            throw new \InvalidArgumentException(
//                <<<MESSAGE
//Tout article différent d'une Chaise en plastique a une qualité de 50 au max
//MESSAGE
//            );
//        }
    }

    public function __toString(): string
    {
        return "{$this->name}, {$this->sellIn}, {$this->quality}";
    }
}
