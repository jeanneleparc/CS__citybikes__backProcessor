var mongoose = require('mongoose');

var stationInformationSchema = mongoose.Schema({
    id: Number,
    name: String,
    longitude: Number,
    latitude: Number,
    last_updated: Date,
    capacity: Number,
});

var stationInformation = module.exports = mongoose.model('stationinformation', stationInformationSchema);

module.exports.get = function (callback, limit) {
    stationInformation.find(callback).limit(limit);
}