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

      /* Get current complaint */

      const result = await pool.query(
        "SELECT escalation_level FROM complaints WHERE id=$1",
        [complaintId]
      );

      let level = result.rows[0].escalation_level;

      let nextAssigned;

      if (level === 0) nextAssigned = "Area Manager";
      else if (level === 1) nextAssigned = "Regional Manager";
      else if (level === 2) nextAssigned = "Head Office";
      else nextAssigned = "Head Office";

      /* Update complaint */

      await pool.query(
        `UPDATE complaints
         SET status='Escalated',
         escalation_level = escalation_level + 1,
         assigned_to=$1
         WHERE id=$2`,
        [nextAssigned, complaintId]
      );

      await pool.query(
  `INSERT INTO complaint_logs (complaint_id, action)
   VALUES ($1,$2)`,
  [complaintId, `Escalated to ${nextAssigned}`]
);

      console.log("⬆ Escalated complaint", complaintId, "to", nextAssigned);

    }

  });

}

startConsumer();

