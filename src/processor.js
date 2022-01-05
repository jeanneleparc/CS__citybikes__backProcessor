// Import contact model
StationStatus = require('./station-status-model');
StationInformation = require('./station-information-model');
moment = require('moment');
var amqp = require('amqplib/callback_api');

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

// Fetch feed status information from NYC Citibike, if a callback is provided do it again every 1s asynchronously.
async function get_feed_status() {
    const url = `https://gbfs.citibikenyc.com/gbfs/en/station_status.json`;
    const rep = await get(url);

    var status = new StationStatus();
    status.data = rep.data;
    status.last_updated = moment(rep.last_updated*1000).subtract(5, 'hours');
    status.ttl = rep.ttl;

    status.save(function (err) {});
}

// Fetch feed station information from NYC Citibike, if a callback is provided do it again every 1s asynchronously.
async function get_feed_information() {
    const url = `https://gbfs.citibikenyc.com/gbfs/en/station_information.json`;
    const rep = await get(url);

    var information = new StationInformation();
    information.data = rep.data;
    information.last_updated = moment(rep.last_updated*1000).subtract(5, 'hours');
    information.ttl = rep.ttl;

    information.save(function (err) {});
}

const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';

async function main() {
    // get_feed_status();
    // get_feed_information();

    amqp.connect(AMQP_URL, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'hello';

            channel.assertQueue(queue, {
                durable: false
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, function(msg) {
                console.log(" [x] Received");
                // console.log(JSON.parse(msg.content));
                const stations = JSON.parse(msg.content).data.stations;
                // console.log(stations);
            }, {
                noAck: true
            });
        });
    });
}

module.exports = { main };