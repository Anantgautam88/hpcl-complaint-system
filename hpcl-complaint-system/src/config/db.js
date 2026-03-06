const { Pool } = require("pg");

const pool = new Pool({
  user: "anantgautam",
  host: "localhost",
  database: "hpcl",
  password: "",
  port: 5432,
});

module.exports = pool;