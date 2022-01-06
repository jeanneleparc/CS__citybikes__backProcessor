var mongoose = require('mongoose');

var stationInformationSchema = mongoose.Schema({
    id: Number,
    capacity: Number,
    has_kiosk: Boolean,
    last_updated: Date,
    latitude: Number,
    longitude: Number,
    name: String,
});

var stationInformation = module.exports = mongoose.model('stationinformation', stationInformationSchema);

module.exports.get = function (callback, limit) {
    stationInformation.find(callback).limit(limit);
}