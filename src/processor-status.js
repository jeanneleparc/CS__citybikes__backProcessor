// Import contact model
StationStatus = require('./station-status-model');
StationInformation = require('./station-information-model');
moment = require('moment');
var amqp = require('amqplib/callback_api');

async function main() {
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'status';

            channel.assertQueue(queue, {
                durable: false
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, function(msg) {
                console.log(" [x] Received");
                const stations = JSON.parse(msg.content).data.stations;
                const time = JSON.parse(msg.content).last_updated;
                // const status = await StationStatus.aggregate([{
                //     $group : { _id: null, max: { $max : "$last_updated" }}
                // }]).exec();

                const agg = StationInformation.aggregate([{ $group: { _id: null, max: { $max : "$last_updated" }}}]);
                for await (const doc of agg) {
                    console.log(doc);
                }
                // stations.forEach((station) => {

                //     var status = new StationStatus();

                //     information.id = parseInt(station.station_id, 10);
                //     information.name = station.name;
                //     information.longitude = station.lon;
                //     information.latitude = station.lat;
                //     information.capacity = station.capacity;
                //     information.last_updated = moment(time*1000).subtract(5, 'hours');
                //     information.save(function (err) {});
                // });
                console.log("Save In DB");
            }, {
                noAck: true
            });
        });
    });
}

module.exports = { main };