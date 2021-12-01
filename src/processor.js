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
    const {
        data: {stations},
        ttl,
    } = await get(url);
    console.log(stations);
}


async function main() {
    get_feed("station_status");
}

module.exports = { main };