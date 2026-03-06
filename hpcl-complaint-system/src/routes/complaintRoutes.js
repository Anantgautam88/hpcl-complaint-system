const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const redisClient = require("../config/redis");

/* Resolve complaint */

router.patch("/complaints/:id/resolve", async (req, res) => {

  const id = req.params.id;

await pool.query(
  `UPDATE complaints
   SET status='Resolved'
   WHERE id=$1`,
  [id]
);

/* LOG RESOLUTION */

await pool.query(
  `INSERT INTO complaint_logs (complaint_id, action)
   VALUES ($1,$2)`,
  [id, "Complaint Resolved"]
);

  /* remove SLA timer */

  await redisClient.del(`sla:${id}`);

  res.json({
    message: "Complaint resolved"
  });

});
/* Get complaint by ID */

router.get("/complaints/:id", async (req, res) => {

  try {

    const id = req.params.id;

    const result = await pool.query(
      `SELECT * FROM complaints
       WHERE id=$1`,
      [id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Server error" });

  }

});



router.get("/complaints", async (req, res) => {

  try {

    const { region, status, priority } = req.query;

    let query = "SELECT * FROM complaints WHERE 1=1";
    const values = [];
    let index = 1;

    if (region) {
      query += ` AND region=$${index}`;
      values.push(region);
      index++;
    }

    if (status) {
      query += ` AND status=$${index}`;
      values.push(status);
      index++;
    }

    if (priority) {
      query += ` AND priority=$${index}`;
      values.push(priority);
      index++;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Server error" });

  }

});




//redis commanfd for giving time this is also very useful feature and realsitic feature 
router.get("/complaints/:id/sla", async (req, res) => {

  const id = req.params.id;

  try {

    const ttl = await redisClient.ttl(`sla:${id}`);

    if (ttl === -2) {
      return res.json({
        message: "No SLA timer found"
      });
    }

    res.json({
      complaint_id: id,
      remaining_seconds: ttl,
      remaining_minutes: Math.floor(ttl / 60)
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch SLA"
    });

  }

});


//history check
router.get("/complaints/:id/history", async (req, res) => {

  const id = req.params.id;

  const result = await pool.query(
    `SELECT action, created_at
     FROM complaint_logs
     WHERE complaint_id=$1
     ORDER BY created_at`,
    [id]
  );

  res.json(result.rows);

});
module.exports = router;