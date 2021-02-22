const {ItemName} = require('./Item');

class QualityAssurance {
    static isShoppingArticleBelowTheQualityStandard(shoppingArticle) {
        return shoppingArticle.quality() < QualityAssurance.MAX_QUALITY;
    }

    static hasShoppingArticleMetTheQualityStandard(shoppingArticle) {
        return shoppingArticle.quality() === QualityAssurance.MAX_QUALITY;
    }

    static isOfAcceptableQuality(item) {
        return !isNaN(item.quality) && item.quality >= 0;
    }

    static isNotOfStandardQuality(shoppingArticle) {
        const isOfStableQuality = typeof QualityAssurance.STANDARD_QUALITY[shoppingArticle.name()] !== 'undefined';

        if (isOfStableQuality) {
            return false
        }

        return true;
    }

    static getStandardQuality(shoppingArticle) {
        if (QualityAssurance.isNotOfStandardQuality(shoppingArticle)) {
            throw 'This item is not of stable quality';
        }

        return QualityAssurance.STANDARD_QUALITY[shoppingArticle.name()];
    }

    static guardAgainstArticleHavingNonCompliantQuality(
        shoppingArticle,
        assessedQuality
    ) {
        if (
            shoppingArticle.isSulfurasItem() &&
            QualityAssurance.getStandardQuality(shoppingArticle) !== assessedQuality
        ) {
            QualityAssurance.throwNonCompliantQualityError(shoppingArticle);
        }
    }

    static throwNonCompliantQualityError(shoppingArticle) {
        throw [
            `Quality of "${shoppingArticle.name()}" items `,
            `has to be compliant with a standard of `,
            `${QualityAssurance.getStandardQuality(shoppingArticle)}.`
        ].join('')
    }
}

QualityAssurance.MAX_QUALITY = 50;
QualityAssurance.STANDARD_QUALITY = {
    [ItemName.sulfurasHandOfRagnaros]: 80
};

module.exports = QualityAssurance;