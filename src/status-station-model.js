// contactModel.js

var mongoose = require('mongoose');

var statusStationSchema = mongoose.Schema({
    data: Object,
    last_updated: Date,
    ttl: Number,
});

// Export Contact model
var StatusStation = module.exports = mongoose.model('status-station', statusStationSchema);

module.exports.get = function (callback, limit) {
    StatusStation.find(callback).limit(limit);
}