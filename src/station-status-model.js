var mongoose = require('mongoose');

var stationStatusSchema = mongoose.Schema({
    id: Number,
    name: String,
    longitude: Number,
    latitude: Number,
    capacity: Number,
    num_docks_available: Number,
    num_bikes_available: Number,
    num_docks_disabled: Number,
    num_bikes_disabled: Number,
    num_ebikes: Number,
    station_status: String,
    is_installed: Boolean,
    last_updated: Date,
});

var stationStatus = module.exports = mongoose.model('stationstatus', stationStatusSchema);

module.exports.get = function (callback, limit) {
    stationStatus.find(callback).limit(limit);
}