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

  /* remove SLA timer */

  await redisClient.del(`sla:${id}`);

  res.json({
    message: "Complaint resolved"
  });

});

/* Get all complaints */

router.get("/complaints", async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT * FROM complaints
       ORDER BY created_at DESC`
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Server error" });

  }

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
module.exports = router;