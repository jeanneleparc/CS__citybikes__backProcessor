// Import contact model
const moment = require("moment");
const amqp = require("amqplib/callback_api");
const StationStatus = require("./station-status-model");
const StationInformation = require("./station-information-model");

const AMQP_URL = process.env.AMQP_URL || "amqp://localhost";

async function main() {
  amqp.connect(AMQP_URL, (error0, connection) => {
    if (error0) {
      throw error0;
    }

    // listen the queue information and save information data in database
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const queueInformation = "information";
      channel.assertQueue(queueInformation, { durable: false });
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queueInformation
      );

      channel.consume(
        queueInformation,
        (msg) => {
          console.log(" [x] Received Information");
          const { stations } = JSON.parse(msg.content).data;
          const time = JSON.parse(msg.content).last_updated;
          stations.forEach((station) => {
            const information = new StationInformation();
            information.id = parseInt(station.station_id, 10);
            information.name = station.name;
            information.longitude = station.lon;
            information.latitude = station.lat;
            information.capacity = station.capacity;
            information.has_kiosk = station.has_kiosk;
            information.last_updated = moment(time * 1000).subtract(5, "hours");
            information.save((err) => err);
          });
          console.log("Save info In DB");
        },
        {
          noAck: true,
        }
      );
    });

    // listen the queue status and save status data in database
    connection.createChannel((error1, channelbis) => {
      if (error1) {
        throw error1;
      }

      const queueStatus = "status";
      channelbis.assertQueue(queueStatus, { durable: false });
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queueStatus
      );

      channelbis.consume(
        queueStatus,
        async (msg) => {
          console.log(" [x] Received Status");
          const { stations } = JSON.parse(msg.content).data;
          const time = JSON.parse(msg.content).last_updated;
          const objectLastUpdated = await StationInformation.find(
            {},
            { last_updated: 1 }
          )
            .sort({ last_updated: -1 })
            .limit(1);
          if (objectLastUpdated.length !== 0) {
            const informations = await StationInformation.find({
              last_updated: objectLastUpdated[0].last_updated,
            });
            stations.forEach((station) => {
              const status = new StationStatus();
              status.id = parseInt(station.station_id, 10);
              status.num_docks_available = station.num_docks_available;
              status.num_bikes_available = station.num_bikes_available;
              status.num_docks_disabled = station.num_docks_disabled;
              status.num_bikes_disabled = station.num_bikes_disabled;
              status.num_ebikes = station.num_ebikes_available;
              status.station_status = station.station_status;
              status.is_installed = station.is_installed;
              status.last_updated = moment(time * 1000).subtract(5, "hours");
              const infoStation = informations.filter(
                (data) => data.id === status.id
              );
              if (infoStation.length !== 0) {
                status.name = infoStation[0].name;
                status.longitude = infoStation[0].longitude;
                status.latitude = infoStation[0].latitude;
                status.capacity = infoStation[0].capacity;
                status.has_kiosk = infoStation[0].has_kiosk;
                status.save((err) => err);
              }
            });
            console.log("Save status In DB");
          }
        },
        {
          noAck: true,
        }
      );
    });
  });
}

module.exports = { main };
