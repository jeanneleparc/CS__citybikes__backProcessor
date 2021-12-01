// Import contact model
StatusStation = require('./status-station-model');
moment = require('moment');

// Quick wrapper function for making a GET call.
function get(url) {
    return new Promise((resolve) => {
        const XMLHttpRequest = require('xhr2');
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "json";
        xhr.onload = () => resolve(xhr.response);
        xhr.send(null);
    });
}

// Fetch feed data from NYC Citibike, if a callback is provided do it again every 1s asynchronously.
async function get_feed(feedname) {
    const url = `https://gbfs.citibikenyc.com/gbfs/en/${feedname}.json`;
    // const {
    //     data: {stations},
    //     ttl,
    // } = await get(url);
    const rep = await get(url);
    // console.log(rep);

    var status = new StatusStation();
    status.data = rep.data;
    status.last_updated = moment(rep.last_updated*1000).subtract(5, 'hours');
    status.ttl = rep.ttl;

    status.save(function (err) {});
}


async function main() {
    get_feed("station_status");
}

module.exports = { main };