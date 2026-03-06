const kafka = require("../config/kafka");
const pool = require("../config/db");

const consumer = kafka.consumer({ groupId: "escalation-group" });

async function startConsumer() {

  await consumer.connect();

  await consumer.subscribe({
    topic: "sla-breach",
    fromBeginning: false
  });

  console.log("Kafka consumer started...");

  await consumer.run({
    eachMessage: async ({ message }) => {

      const data = JSON.parse(message.value.toString());

      const complaintId = data.complaint_id;

      console.log("Processing escalation for complaint:", complaintId);

      /* Update complaint in database */

      await pool.query(
        `UPDATE complaints
         SET status='Escalated',
         escalation_level = escalation_level + 1,
         assigned_to='Area Manager'
         WHERE id=$1`,
        [complaintId]
      );

      console.log("Complaint escalated:", complaintId);

    }
  });

}

startConsumer();