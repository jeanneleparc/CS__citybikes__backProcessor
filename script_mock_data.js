const mongoose = require('mongoose');
const XMLHttpRequest = require('xhr2');
const { exists } = require('./src/stats-by-station-by-hour-model');
moment = require('moment');

StatsByStationByHour = require('./src/stats-by-station-by-hour-model');
StationStatus = require('./src/station-status-model');
StationInformation = require('./src/station-information-model');

async function get(url) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "json";
        xhr.onload = () => resolve(xhr.response);
        xhr.send(null);
    });
}

async function main(){
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/citibikes';
    
    const url = `https://gbfs.citibikenyc.com/gbfs/en/station_information.json`;
    const station_information = await get(url);
    let todayDate = moment().utc().subtract(5, 'hours').startOf('day');
    console.log(todayDate);
  
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => console.log('MongoDB connected : %s', MONGO_URI))
            .catch(err => console.log(err));
        
        station_information.data.stations.slice(0,51).forEach((station, index) => {
            let capacity = station.capacity;
            let first = true;
            for (let i = 30; i >= 0; i--){
                let currentMockDate = todayDate.clone().subtract(i, 'days');
                for (let j = 0; j<=23; j++){
                    var stat = new StatsByStationByHour();
                    stat.station_id = parseInt(station.station_id, 10);
                    stat.station_name = station.name;
                    stat.station_long = station.lon;
                    stat.station_lat = station.lat;
                    stat.time_slot = j;
                    let rate = Math.random();
                    stat.filling_rate = rate;
                    stat.avg_bikes_nb = rate*capacity;
                    stat.date = currentMockDate;
                    stat.save(function(err, doc) {
                        if (err) return console.error(err);
                        if (first){
                            first = false;
                            if (index %10 == 0){
                                console.log(index,'/', 50);
                            }
                        }
                        if (index == 50 && i == 0 && j ==23){
                            process.exit(0);
                        }
                      });
                }
            }
        });
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
