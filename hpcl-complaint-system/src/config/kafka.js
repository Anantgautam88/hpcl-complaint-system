const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "hpcl-complaint-system",
  brokers: ["localhost:9092"]
});

module.exports = kafka;