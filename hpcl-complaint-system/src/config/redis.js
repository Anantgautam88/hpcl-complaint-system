const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://127.0.0.1:6379"
});

redisClient.connect();

redisClient.on("error", (err) => {
  console.log("Redis error:", err);
});

module.exports = redisClient;