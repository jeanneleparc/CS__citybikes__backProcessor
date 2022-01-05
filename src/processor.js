// Import contact model
StationStatus = require('./station-status-model');
StationInformation = require('./station-information-model');
moment = require('moment');
var amqp = require('amqplib/callback_api');
const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';

async function main() {
    amqp.connect(AMQP_URL, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'information';

            channel.assertQueue(queue, {
                durable: false
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, function(msg) {
                console.log(" [x] Received Information");
                const stations = JSON.parse(msg.content).data.stations;
                const time = JSON.parse(msg.content).last_updated;
                stations.forEach((station) => {
                    var information = new StationInformation();
                    information.id = parseInt(station.station_id, 10);
                    information.name = station.name;
                    information.longitude = station.lon;
                    information.latitude = station.lat;
                    information.capacity = station.capacity;
                    information.last_updated = moment(time*1000).subtract(5, 'hours');
                    information.save(function (err) {});
                });
                console.log("Save info In DB");
            }, {
                noAck: true
            });
        });
        connection.createChannel(function(error1, channelbis) {
            if (error1) {
                throw error1;
            }

            var queue = 'status';

            channelbis.assertQueue(queue, {
                durable: false
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channelbis.consume(queue, async function(msg) {
                console.log(" [x] Received Status");
                const stations = JSON.parse(msg.content).data.stations;
                const time = JSON.parse(msg.content).last_updated;
                const object_last_updated = await StationInformation.find({},{last_updated:1}).sort({'last_updated':-1}).limit(1);
                const informations = await StationInformation.find({last_updated: object_last_updated[0].last_updated},);
                stations.forEach((station) => {
                    var status = new StationStatus();
                    status.id = parseInt(station.station_id, 10);
                    status.num_docks_available = station.num_docks_available;
                    status.num_bikes_available = station.num_bikes_available;
                    status.station_status = station.station_status;
                    status.is_installed = station.is_installed;
                    status.last_updated = moment(time*1000).subtract(5, 'hours');
                    const info_station = informations.filter((data) => { return data.id == status.id});
                    if( info_station.length != 0){
                        status.name = info_station[0].name;
                        status.longitude = info_station[0].longitude;
                        status.latitude = info_station[0].latitude;
                        status.capacity = info_station[0].capacity;
                        status.save(function (err) {});
                    }
                });
                console.log("Save status In DB");
            }, {
                noAck: true
            });
        });
    });
}

module.exports = { main };