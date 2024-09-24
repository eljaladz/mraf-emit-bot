const readlineSync = require("readline-sync");
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

async function defaultMode(TOKENS) {
  process.stdout.write("\x1Bc");
  await showHead();
  await delay(500);
  console.log("Running Default Mode...".yellow);
  await delay(500);

  const currentTime = new Date();
  console.log(`Current time: ${currentTime.toLocaleTimeString("en-GB")}\n`);

  console.log(`Fetching user information, please wait...`.gray);
  const list = await userInfo(TOKENS, getFarmInfo, getRefInfo, levelInfo);
  console.log(list);
  await delay(1000);

  try {
    const select = readlineSync.question(`
Select the feature you want to use:
1. ☘  Autofarming
2. ✎  Autocomplete available tasks
3. 🗣  Autoclaim referral rewards
4. 🕰  Clock Upgrade
5. ↺  Exit

Input your selection: `);
      console.log('');

      if (select === '1') {
        await finishFarm(TOKENS);
        await startFarm(TOKENS);
      } else if (select === '2') {
        await fetchStartTasks(TOKENS);
      } else if (select === '3') {
        await refReward(TOKENS);
      } else if (select === '4') {
        await upClock(TOKENS);
      } else if (select === '5') {
        console.log("Exiting Default Mode...\n".gray);
        await delay(1000);
        console.log(`            @NoDrops`.blue);
        console.log(`Subscribe: https://t.me/NoDrops`.blue);
        console.log(`         ☂ ANTI BONCOS ☂\n`.blue);
        process.exit(0);
      } else {
        console.log("✖ Invalid selection. Please try again.".red);
        process.exit(1);
      }
  } catch (error) {
    console.log("Error: ${error.message}".red);
  }
}

module.exports = {
  defaultMode,
};
