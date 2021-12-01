var mongoose = require('mongoose');

var stationInformationSchema = mongoose.Schema({
    data: Object,
    last_updated: Date,
    ttl: Number,
});

var stationInformation = module.exports = mongoose.model('station-information', stationInformationSchema);

module.exports.get = function (callback, limit) {
    stationInformation.find(callback).limit(limit);
}