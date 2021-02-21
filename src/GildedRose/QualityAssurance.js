
const {Item, ItemName} = require('./Item');

class QualityAssurance {
    static isOfAcceptableQuality(item) {
        return !isNaN(item.quality) && item.quality >= 0;
    }
}

QualityAssurance.MAX_QUALITY = 50;
QualityAssurance.STABLE_QUALITY_OVER_TIME = {
    [ItemName.sulfurasHandOfRagnaros]: 80
};

module.exports = QualityAssurance;