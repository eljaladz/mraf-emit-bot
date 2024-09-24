require("colors");
const {
  getFarmInfo,
  finishFarming,
  startFarming,
  getTasks,
  startTask,
  claimTaskReward,
  claimRefReward,
  levelUpgrade,
  getRefInfo,
} = require("../utils/api");
const List = require("cli-table3");
const moment = require("moment");

async function botHead() {
    process.stdout.write("\x1Bc");
    const bot = `
 _____________________________________________________ 
|                      _____                  _ _____ |
|  _ __ ___  _ __ __ _|  ___|   ___ _ __ ___ (_)_   _||
| |  _   _  |  __/ _  | |_     / _    _   _  | | | |  |
| | | | | | | | | (_| |  _|   |  __/ | | | | | | | |  |
| |_| |_| |_|_|   __,_|_|       ___|_| |_| |_|_| |_|  |
|_____________________________________________________|
    `;
    console.log(bot);
    console.log('');
}

async function showHead() {
  const art = `
       _  __        ___                        
      / |/ / ___   / _ \\  ____ ___    ___   ___
     /    / / _ \\ / // / / __// _ \\  / _ \\ (_-<
    /_/|_/  \\___//____/ /_/   \\___/ / .__//___/
                                   /_/         
    `.blue;
  console.log("                     Created by:                 ".cyan);
  console.log(art);
  console.log("              ☂ https://t.me/NoDrops ☂          \n".cyan);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function randomDelay(minSeconds, maxSeconds) {
  const minMs = minSeconds * 1000;
  const maxMs = maxSeconds * 1000;
  const randomMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, randomMs));
}

async function userInfo(TOKENS, getFarmInfo, getRefInfo, levelInfo) {
  const table = new List({
    head: ["Number", "Balance", "Level", "Referral(s)"],
    colWidths: [10, 15, 10, 15],
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: " ",
    },
    style: { "padding-left": 0, "padding-right": 0 },
  });

  let counter = 1;

  for (const TOKEN of TOKENS) {
    const user = await getFarmInfo(TOKEN);
    const levels = await levelInfo;
    const ref = await getRefInfo(TOKEN);

    if (user && ref) {
      const userLevel = levels.find(
        (level) => level.farmingReward === user.farmingReward
      );
      if (userLevel) {
        table.push([counter, user.balance, userLevel.level, `${ref.referral}`]);
      }
    }
    counter++;
  }

  return table.toString();
}

async function refReward(TOKENS) {
  for (const [index, TOKEN] of TOKENS.entries()) {
    console.log("Checking referral reward...".gray);
    await delay(1000);
    console.log(`Account ${index + 1}:`);

    try {
      const ref = await getRefInfo(TOKEN);
      const bal = await getFarmInfo(TOKEN);
      if (ref.referral === 0) {
        console.log(`There's no referral reward.`.red);
        console.log("✖ Failed to claim referral reward.\n".red);
      } else {
        console.log("Trying to claim referral reward...".yellow);
        const claim = await claimRefReward(TOKEN);
        await delay(500);
        if (claim === "OK") {
          console.log(`✔ Referral reward has been claimed!`.green);
          console.log(`Current balance: ${bal.balance}\n`.cyan);
        }
      }
    } catch (error) {
      console.log(`✖ Error occured: ${error.response}\n`.red);
    }
  }
}

async function finishFarm(TOKENS) {
  for (const [index, TOKEN] of TOKENS.entries()) {
    console.log(`Account ${index + 1}:`);
    console.log("Claiming farming reward...".gray);
    await delay(1000);
    const claimFarm = await finishFarming(TOKEN);

    if (claimFarm) {
      console.log(`✔ Farming reward claimed!`.green);
      console.log(`Current balance: ${claimFarm.balance}\n`.cyan);
    } else {
      console.log("✖ Failed to claim. Try again later!\n".red);
    }
    await delay(1000);
  }
}

async function startFarm(TOKENS) {
  for (const [index, TOKEN] of TOKENS.entries()) {
    console.log(`Account ${index + 1}:`);
    console.log("Starting farming session...".gray);
    await delay(1000);

    try {
      const farming = await startFarming(TOKEN);
      if (farming) {
        console.log(`✔ Farming started!`.green);
        console.log(`Current balance: ${farming.balance}`.cyan);
        console.log(`Farming duration: ${farming.duration} hours`.cyan);
        console.log(
          `Available to claim at: ${moment(farming.end).format(
            "MMM DD, YYYY [at] HH:mm"
          )}\n`.cyan
        );
      } else {
        const info = await getFarmInfo(TOKEN);

        if (info) {
          const start = info.activeFarmingStartedAt || new Date().toISOString();
          const end = moment(start)
            .add(info.farmingDurationInSec, "seconds")
            .format("MMM DD, YYYY, HH:mm");

          console.log(`Avaliable to claim at: ${end}\n`.cyan);
        }
      }
    } catch (error) {
      console.log("✖ Failed to start farming.\n".red);
    }
    await delay(1000);
  }
}

async function fetchStartTasks(TOKENS) {
  for (const [index, TOKEN] of TOKENS.entries()) {
    console.log("Getting available task information...".gray);
    await delay(1000);
    console.log(`Account ${index + 1}:`);
    const tasks = await getTasks(TOKEN);

    for (const task of tasks) {
      const { id, title, type, status, chatId } = task;

      if (status) {
        if (status === "SUBMITTED") {
          console.log(`"${title}" submission has been submitted.`.blue);
          console.log(`Trying to claim "${title}" reward...`.yellow);
          const claimTask = await claimTaskReward(TOKEN, id, title);
          await delay(500);
          if (claimTask === "OK") {
            console.log(
              `"${title}" reward has been successfully claimed!`.green
            );
            await delay(500);
          }
        } else if (status === "COMPLETED") {
          console.log(`"${title}" has been completed.`.blue);
          console.log(`Trying to claim "${title}" reward...`.yellow);
          const claimTask = await claimTaskReward(TOKEN, id, title);
          await delay(500);
          if (claimTask === "OK") {
            console.log(
              `"${title}" reward has been successfully claimed!`.green
            );
            await delay(500);
          }
        } else if (status === "CLAIMED") {
          console.log(`"${title}" reward has been claimed.`.cyan);
          await delay(500);
        } else if (status === "REJECTED") {
          if (!chatId && type !== "ADSGRAM" && type !== "API_CHECK") {
            console.log(
              `"${title}" submission has been rejected. Attempting to complete...`
                .yellow
            );
            await delay(500);
            console.log(`Completing "${title}" submission...`.blue);
            await delay(500);
            await startTask(TOKEN, id, title);
            await delay(500);
            console.log(`Trying to claim "${title}" reward...`.yellow);
            const claimTask = await claimTaskReward(TOKEN, id, title);
            if (claimTask === "OK") {
              console.log(
                `"${title}" reward has been successfully claimed!`.green
              );
            }
          } else {
            console.log(
              `"${title}" task has been rejected. Please do it manually!`.red
            );
          }
          await delay(500);
        }
      } else {
        if (!chatId && type !== "ADSGRAM" && type !== "API_CHECK") {
          console.log(`Completing "${title}" task...`.yellow);
          await delay(1000);
          await startTask(TOKEN, id, title);
          await delay(500);
        } else {
          console.log(
            `Skipping the "${title}" task. Please do it manually!`.red
          );
          await delay(500);
        }
      }
    }
    console.log("");
  }
}

async function upClock(TOKENS) {
  for (const [index, TOKEN] of TOKENS.entries()) {
    console.log("Upgrading clock level...".gray);
    await delay(1000);
    console.log(`Account ${index + 1}:`);
    const clock = await levelUpgrade(TOKEN);
    const info = await getFarmInfo(TOKEN);

    if (clock && clock.balance && clock.level && clock.duration) {
      console.log(`✔ Clock was upgraded!`.green);
      console.log(`Current balance: ${clock.farmInfo.balance}`.cyan);
      console.log(`Current level: ${clock.level}`.cyan);
      console.log(`Farming duration: ${clock.duration}\n`.cyan);
      await delay(500);

      console.log("Updating farming data...".yellow);
      if (info && info.reward && info.end) {
        console.log(`✔ Updated!`.green);
        console.log(`Farming reward: ${info.reward}`.cyan);
        console.log(
          `Available to claim at: ${moment(info.end).format(
            "MMM DD, YYYY [at] HH:mm"
          )}\n`.cyan
        );
      } else {
        console.log(
          "✖ Failed to get recent data. Please check manually!\n".red
        );
      }
    } else {
      console.log("✖ Failed to upgrade. Please try again later!\n".red);
    }
  }
}

module.exports = {
    botHead,
  showHead,
  randomDelay,
  delay,
  userInfo,
  finishFarm,
  startFarm,
  refReward,
  fetchStartTasks,
  upClock,
};
