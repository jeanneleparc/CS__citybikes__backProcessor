const mongoose = require("mongoose");

const stationInformationSchema = mongoose.Schema({
  id: Number,
  capacity: Number,
  has_kiosk: Boolean,
  last_updated: Date,
  latitude: Number,
  longitude: Number,
  name: String,
});

const stationInformation = mongoose.model(
  "stationinformation",
  stationInformationSchema
);
module.exports = stationInformation;

module.exports.get = function (callback, limit) {
  stationInformation.find(callback).limit(limit);
};
