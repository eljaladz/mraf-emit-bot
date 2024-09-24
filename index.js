const fs = require("fs");
const readlineSync = require("readline-sync");
const { showHead, botHead } = require("./utils/core");
const { defaultMode } = require("./script/default");
const { loopMode } = require("./script/loop");

const TOKENS = JSON.parse(fs.readFileSync('tokens.json', 'utf-8'));

async function botStart() {
    await botHead();
    await showHead();

    const options = readlineSync.question(
        `Select which mode to run::\n1. Default Mode\n2. Loop Mode\nInput your selection: `
    );

    if (options === '1') {
        console.log('');
        await defaultMode(TOKENS);
    } else if (options === '2') {
        console.log('');
        await loopMode(TOKENS);
    } else {
        console.log("Invalid selection. Please try again.".red);
        process.exit(1);
    }
}

botStart();