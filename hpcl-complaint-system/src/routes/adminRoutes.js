const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* Total complaints */

router.get("/total-complaints", async (req, res) => {

  const result = await pool.query(
    "SELECT COUNT(*) FROM complaints"
  );

  res.json({ total_complaints: result.rows[0].count });

});

/* Complaints by region */

router.get("/complaints-by-region", async (req, res) => {

  const result = await pool.query(
    `SELECT region, COUNT(*) 
     FROM complaints
     GROUP BY region`
  );

  res.json(result.rows);

});

module.exports = router;