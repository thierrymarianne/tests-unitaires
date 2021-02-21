
const Item = require('./Item');

class QualityAssurance {
    static isOfAcceptableQuality(item) {
        return !isNaN(item.quality) && item.quality >= 0;
    }
}

QualityAssurance.MAX_QUALITY = 50;

module.exports = QualityAssurance;