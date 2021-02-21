const {ItemName} = require('./Item');

class QualityAssurance {
    static isOfAcceptableQuality(item) {
        return !isNaN(item.quality) && item.quality >= 0;
    }

    static isNotOfStableQuality(shoppingArticle) {
        const isOfStableQuality = typeof QualityAssurance.STABLE_QUALITY_OVER_TIME[shoppingArticle.name()] !== 'undefined';

        if (isOfStableQuality) {
            return false
        }

        return true;
    }

    static getStableQuality(shoppingArticle) {
        if (QualityAssurance.isNotOfStableQuality(shoppingArticle)) {
            throw 'This item is not of stable quality';
        }

        return QualityAssurance.STABLE_QUALITY_OVER_TIME[shoppingArticle.name()];
    }

    static throwNonCompliantQualityError(shoppingArticle) {
        throw [
            `Quality of "${shoppingArticle.name()}" items `,
            `has to be compliant with a standard of `,
            `${QualityAssurance.getStableQuality(shoppingArticle)}.`
        ].join('')
    }
}

QualityAssurance.MAX_QUALITY = 50;
QualityAssurance.STABLE_QUALITY_OVER_TIME = {
    [ItemName.sulfurasHandOfRagnaros]: 80
};

module.exports = QualityAssurance;