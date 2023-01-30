# Test unitaires en PHP

## Pré-requis

 - [PHP 8.0+](https://www.php.net/downloads.php)
 - [Composer](https://getcomposer.org), gestionnaire de dépendances 📦
 - [Git](https://git-scm.com/downloads), système de contrôle de version

## Installation

Cloner le projet avec git

```shell
git clone https://github.com/thierrymarianne/tests-unitaires
```

Installer les dépendances du projet avec composer

```shell
composer install
```

## Dépendances

La dépendance principale de ce projet est 
 - [PHPUnit](https://phpunit.de/)

## Répertoires

- `src` : contient deux classes :
    - `Item.php`
       Cette classe ne doit pas être modifiée
    - `GildedRose.php`
       Cette classe doit être mise à jour, 
       et la nouvelle fonctionnalité y sera ajoutée
- `tests` : contient les tests
    - `GildedRoseTest.php`
       Test de démarrage
- `Fixture`
    - `texttest_fixture.php` 
       Pourra être utilisé par `ApprovalTests`, 
       ou exécuté depuis la ligne de commande

## Jeu de données de test

Pour faire usage du jeu de données de test :

```shell
php ./fixtures/texttest_fixture.php 10
```

Remplacer **10** par le nombre de jours à prendre en compte.

## Lancement des tests

PHPUnit est configuré pour les tests unitaires, 
un script composer a été fourni. 

Afin de lancer les tests unitaires, exécuter à la racine du projet :

```shell
composer tests
```

### Lancement des tests avec couverture

Afin de lancer tous les tests et de générer un rapport complet HTML,
lancer :

```shell
composer test-coverage
```

Le dossier `/builds` contiendra le rapport de couverture de tests.
Il sera possible de glisser-déposer `/builds/index.html` dans son navigateur afin de le consulter.

ℹ L'extension [XDEbug](https://xdebug.org/download) pour PHP est un pré-requis à la génération de rapport de couverture.
