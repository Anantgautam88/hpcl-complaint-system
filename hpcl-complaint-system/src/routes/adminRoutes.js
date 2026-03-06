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

//dealer-performance!
router.get("/dealer-performance", async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT assigned_to,
              COUNT(*) AS total_complaints,
              SUM(CASE WHEN status='Resolved' THEN 1 ELSE 0 END) AS resolved,
              SUM(CASE WHEN status='Escalated' THEN 1 ELSE 0 END) AS escalated
       FROM complaints
       GROUP BY assigned_to`
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch dealer performance"
    });

  }

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

router.get("/dashboard", async (req, res) => {

  try {

    /* Total complaints */

    const total = await pool.query(
      `SELECT COUNT(*) FROM complaints`
    );

    /* Pending complaints */

    const pending = await pool.query(
      `SELECT COUNT(*) FROM complaints
       WHERE status='Pending'`
    );

    /* Escalated complaints */

    const escalated = await pool.query(
      `SELECT COUNT(*) FROM complaints
       WHERE status='Escalated'`
    );

    /* Resolved complaints */

    const resolved = await pool.query(
      `SELECT COUNT(*) FROM complaints
       WHERE status='Resolved'`
    );

    /* Complaints by region */

    const regions = await pool.query(
      `SELECT region, COUNT(*) as count
       FROM complaints
       GROUP BY region`
    );

    res.json({

      total_complaints: total.rows[0].count,

      pending_complaints: pending.rows[0].count,

      escalated_complaints: escalated.rows[0].count,

      resolved_complaints: resolved.rows[0].count,

      complaints_by_region: regions.rows

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Dashboard fetch failed"
    });

  }

});

module.exports = router;