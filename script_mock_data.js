const mongoose = require("mongoose");
const XMLHttpRequest = require("xhr2");
const moment = require("moment");

const StatsByStationByHour = require("./src/stats-by-station-by-hour-model");

async function get(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.onload = () => resolve(xhr.response);
    xhr.send(null);
  });
}

async function main() {
  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/citibikes";

  const url = `https://gbfs.citibikenyc.com/gbfs/en/station_information.json`;
  const stationInformation = await get(url);
  const todayDate = moment().utc().subtract(5, "hours").startOf("day");
  console.log(todayDate);

  try {
    await mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected : %s", MONGO_URI))
      .catch((err) => console.log(err));

    stationInformation.data.stations.slice(0, 51).forEach((station, index) => {
      const { capacity } = station;
      for (let i = 30; i >= 0; i-=1) {
        const currentMockDate = todayDate.clone().subtract(i, "days");
        for (let j = 0; j <= 23; j+=1) {
          const stat = new StatsByStationByHour();
          stat.station_id = parseInt(station.station_id, 10);
          stat.station_name = station.name;
          stat.station_long = station.lon;
          stat.station_lat = station.lat;
          stat.time_slot = j;
          const rate = Math.random();
          stat.filling_rate = rate;
          stat.avg_bikes_nb = rate * capacity;
          stat.date = currentMockDate;
          stat.save((err) => {
            if (err) return console.error(err);
            if (index % 10 == 0 && i === 30 && j === 0) {
                console.log(index, "/", 50);
            }
            if (index === 50 && i === 0 && j === 23) {
              process.exit(0);
            }
            return;
          });
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);
