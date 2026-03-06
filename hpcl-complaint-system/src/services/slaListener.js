const redis = require("redis");

const subscriber = redis.createClient();

async function startListener() {

  await subscriber.connect();

  console.log("SLA Listener started...");

  await subscriber.subscribe("__keyevent@0__:expired", (key) => {

    if (key.startsWith("sla:")) {

      const complaintId = key.split(":")[1];

      console.log("SLA breached for complaint:", complaintId);

    }

  });

}

startListener();