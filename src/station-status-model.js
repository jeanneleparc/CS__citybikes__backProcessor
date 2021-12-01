var mongoose = require('mongoose');

var stationStatusSchema = mongoose.Schema({
    data: Object,
    last_updated: Date,
    ttl: Number,
});

var stationStatus = module.exports = mongoose.model('station-status', stationStatusSchema);

module.exports.get = function (callback, limit) {
    stationStatus.find(callback).limit(limit);
}