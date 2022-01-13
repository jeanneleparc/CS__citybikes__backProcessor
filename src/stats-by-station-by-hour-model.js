const mongoose = require("mongoose");

const statsByStationByHourSchema = mongoose.Schema({
  station_id: Number,
  station_name: String,
  station_long: Number,
  station_lat: Number,
  time_slot: Number,
  filling_rate: Number,
  avg_bikes_nb: Number,
  date: Date,
});

const statsByStationByHour = mongoose.model(
  "statsbystationbyhour",
  statsByStationByHourSchema
);

module.exports = statsByStationByHour;

module.exports.get = function (callback, limit) {
  statsByStationByHour.find(callback).limit(limit);
};
