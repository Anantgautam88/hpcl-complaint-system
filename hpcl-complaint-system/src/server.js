const express = require("express");
const pool = require("./config/db");
const redisClient = require("./config/redis");

const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/", complaintRoutes);
app.use("/admin",adminRoutes);



/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Server is working");
});

/* CREATE COMPLAINT */
app.post("/complaints", async (req, res) => {
  try {
    const { category, priority, region } = req.body;

    let slaHours;

    if (priority === "HIGH") slaHours = 24;
    else if (priority === "MEDIUM") slaHours = 48;
    else slaHours = 72;

    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const result = await pool.query(
      `INSERT INTO complaints (category, priority, region, sla_deadline)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [category, priority, region, slaDeadline]
    );

    const complaintId = result.rows[0].id;

    await redisClient.setEx(
      `sla:${complaintId}`,
      slaHours * 3600,
      "ACTIVE"
    );

    /* SEND RESPONSE */

    res.json({
      message: "Complaint created",
      complaint: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating complaint");
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});