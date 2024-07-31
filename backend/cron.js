import cron from "cron";
import https from "https";

const URL = "";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log("GET REQUEST SENT SUCCESSFULLY");
      } else {
        console.log("GET REQUEST FAILED", res.statusCode);
      }
    })
    .on("error", (e) => {
      console.log("ERROR WHILE SENDING REQUEST", e);
    });
});

export default job;
