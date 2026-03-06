const kafka = require("../config/kafka");

const producer = kafka.producer();

async function sendSLAEvent(complaintId) {

  await producer.connect();

  await producer.send({
    topic: "sla-breach",
    messages: [
      {
        value: JSON.stringify({
          complaint_id: complaintId,
          event: "SLA_BREACH"
        })
      }
    ]
  });

  console.log("Kafka event sent for complaint:", complaintId);

}

module.exports = sendSLAEvent;