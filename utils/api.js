const axios = require("axios");
const URL = "https://tg-bot-tap.laborx.io/api/v1";

async function getBalanceInfo(token) {
  try {
    const data = await axios({
      url: `${URL}/balance`,
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return {
      balance: data.balance,
      referral: data.referral,
    };
  } catch (error) {
    console.log(`✖ Error occured:  ${error.response}`.red);
  }
}

async function getRefInfo(token) {
  try {
    const { data } = await axios({
      url: `${URL}/referral/link`,
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    });

    return {
      referral: data.userCount,
    };
  } catch (error) {
    console.log(`✖ Error occured:  ${error.response}`.red);
  }
}

async function getFarmInfo(token) {
  try {
    const { data } = await axios({
      url: `${URL}/farming/info`,
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error('Error, failed to retrieve token(s)'.red);
      console.error('Please update the token or check your internet connection.'.red);
      process.exit(1);
    } else {
      console.log(`✖ Error occured:  ${error.response}`.red);
    }
  }
}

async function finishFarming(token) {
  try {
    const { data } = await axios({
      url: `${URL}/farming/finish`,
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error("Farming hasn't started yet or is still in progress!".red);
    } else {
      console.log(`✖ Error occured:  ${error.response}`.red);
    }
  }
}

async function startFarming(token) {
  try {
    const { data } = await axios({
      url: `${URL}/farming/start`,
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });

    const startTime = new Date(data.activeFarmingStartedAt);
    const endTime = new Date(
      startTime.getTime() + data.farmingDurationInSec * 1000
    );

    return {
      balance: data.balance,
      start: data.activeFarmingStartedAt,
      duration: data.farmingDurationInSec / 3600,
      end: endTime.toISOString(),
    };
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log("Farming already started or need to claim first!.".red);
    } else {
      console.log(`✖ Error occured:  ${error.response}`.red);
    }
  }
}

async function getTasks(token) {
  try {
    const { data } = await axios({
      url: `${URL}/tasks`,
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    });

    const taskInfo = data.map((task) => ({
      id: task.id,
      title: task.title,
      type: task.type,
      status: task.submission ? task.submission.status : null,
      chatId: task.chatId,
    }));
    return taskInfo;
  } catch (error) {
    console.log(`✖ Error getting tasks information:  ${error.response}`.red);
    return [];
  }
}

async function startTask(token, id, title) {
  try {
    const { data } = await axios({
      url: `${URL}/tasks/${id}/submissions`,
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      data: {},
    });

    return data;
  } catch (error) {
    console.error(`"${title}" failed to start. Please do it manually!`.red);
    return [];
  }
}

async function claimTaskReward(token, id, title) {
  try {
    const { data } = await axios({
      url: `${URL}/tasks/${id}/claims`,
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      data: {},
    });

    return data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(
        `Failed to claim "${title}" reward. Please try again in a few hours!.`
          .red
      );
    } else {
      console.error(`✖ Error occured: ${error.response}`.red);
    }
    return [];
  }
}

async function claimRefReward(token) {
  try {
    const { data } = await axios({
      url: `${URL}/balance/referral/claim`,
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      data: {},
    });

    return data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log("There's no referral reward.\n".red);
    } else {
      console.log(`✖ Error occured:  ${error.response}`.red);
    }
  }
}

async function levelUpgrade(token) {
  try {
    const { data } = await axios({
      url: `${URL}/me/level/upgrade`,
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      data: {},
    });
    return {
      level: data.level,
      balance: data.balance,
      duration: data.farmingInfo.farmingDurationInSec / 3600,
    };
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log("Upgrade unavailable or balance too low.".red);
    } else {
      console.log(`✖ Error occured: "${error.response}"`.red);
    }
  }
}

module.exports = {
  getBalanceInfo,
  getFarmInfo,
  getRefInfo,
  finishFarming,
  startFarming,
  getTasks,
  startTask,
  claimTaskReward,
  claimRefReward,
  levelUpgrade,
};
