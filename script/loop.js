const cron = require("node-cron");
const { levelInfo } = require("../utils/levels");
const { getFarmInfo, getRefInfo } = require("../utils/api");
const {
  showHead,
  delay,
  finishFarm,
  startFarm,
  refReward,
  fetchStartTasks,
  upClock,
  userInfo,
} = require("../utils/core");

async function loopMode(TOKENS) {
  process.stdout.write("\x1Bc");
  await showHead();
  await delay(500);
  console.log("Running Loop Mode...".yellow);
  await delay(500);

  const currentTime = new Date();
  console.log(`Current time: ${currentTime.toLocaleTimeString("en-GB")}\n`);

  const list = await userInfo(TOKENS, getFarmInfo, getRefInfo, levelInfo);
  console.log(list);
  console.log("");
  await delay(500);

  console.log("Running all functions before scheduling starts...\n".yellow);
  await delay(1000);

  await finishFarm(TOKENS);
  await startFarm(TOKENS);
  await refReward(TOKENS);
  await fetchStartTasks(TOKENS);

  await upClock(TOKENS);

  await delay(500);
  console.log(`Completed! ✓\n`.green);
  await delay(1000);
  console.log(`            @NoDrops`.blue);
  console.log(`Subscribe: https://t.me/NoDrops`.blue);
  console.log(`         ☂ ANTI BONCOS ☂\n`.blue);
  await delay(1000);
  console.log("Loop Mode has been scheduled.".yellow);

  cron.schedule("0 0-23 * * *", async () => {
    process.stdout.write("\x1Bc");
    await showHead();
    const currentTime = new Date();
    console.log(`Current time: ${currentTime.toLocaleTimeString("en-GB")}`);
    console.log(`Loop Mode is still running. Please be patient!\n`.yellow);
  });

  cron.schedule("5 0,4,8,12,16 * * *", async () => {
    process.stdout.write("\x1Bc");
    await showHead();
    await delay(500);
    console.log(`Refreshing data, please wait...`.yellow);
    console.log("");
    console.log(`Current time: ${currentTime.toLocaleTimeString("en-GB")}`);
    await userInfo(TOKENS, getFarmInfo, getRefInfo, levelInfo);
    console.log("");
    await finishFarm(TOKENS);
    await startFarm(TOKENS);
    await delay(500);
    console.log("Completed! ✓".green);
  });

  cron.schedule("30 0 * * *", async () => {
    process.stdout.write("\x1Bc");
    await showHead();
    await delay(500);
    console.log(`Refreshing data, please wait...`.yellow);
    console.log("");
    console.log(`Current time: ${currentTime.toLocaleTimeString("en-GB")}`);
    await userInfo(TOKENS, getFarmInfo, getRefInfo, levelInfo);
    console.log("");
    await refReward(TOKENS);
    await upClock(TOKENS);
    await delay(500);
    console.log("Completed! ✓".green);
  });

  cron.schedule("0 1 * * *", async () => {
    process.stdout.write("\x1Bc");
    await showHead();
    await delay(500);
    console.log(`Refreshing data, please wait...`.yellow);
    console.log("");
    console.log(`Current time: ${currentTime.toLocaleTimeString("en-GB")}`);
    await userInfo(TOKENS, getFarmInfo, getRefInfo, levelInfo);
    console.log("");
    await fetchStartTasks(TOKEN);
    await delay(500);
    console.log("Completed! ✓".green);
  });
}

module.exports = {
  loopMode,
};
