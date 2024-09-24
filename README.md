# mraF emiT Airdrop Bot
---
## Disclaimer

This project is for educational purposes only. Use at your own risk. The authors are not responsible for any consequences resulting from the use of this software.

## Features

| Features                                  |   Status  |
| ----------------------------------------- | :-------: |
| Claiming daily reward                     |    ❌     |
| Claiming farming reward                   |    ✅     |
| Claiming referral reward                  |    ✅     |
| Claiming tasks reward                     |    ✅     |
| Starting farming                          |    ✅     |
| Completing available tasks                |    ✅     |
| Upgrade clock level                       |    ✅     |
| Scheduled function execution (Loop Mode)  |    ✅     |

## Requirements
- Node.js v14 or higher.
- npm v6.14.x or higher.
- [Time Farm Telegram Bot](https://t.me/TimeFarmCryptoBot?start=W4OyQGZM5rZK8r88) account(s).

## Installation

1. Download this [**repository**](https://github.com/eljaladz/mraf-emit-bot) by cloning it to your system:

   ```bash
   git clone https://github.com/eljaladz/mraf-emit-bot.git
   ```

2. Install dependencies:

   ```bash
   cd mraf-emit-bot && npm install
   ```

3. Edit `tokens.json` file in the project root directory:

    ```bash
    nano tokens.json
    ```

> The `tokens.json` file should be an array of strings and each string should be a token for one account:
> 
> ```json
> [
>   "paste_your_token_1_here",
>   "paste_your_token_2_here",
>   "paste_your_token_3_here"
> ]
>```

---
### How to get your Token

1. Login to your [Telegram](https://web.telegram.org/) account.
2. Open the developer tools by pressing `F12` or right-clicking anywhere in the bot and selecting **inspect element** to open the browser's developer tools from your Chromium based browser(e.g Brave, Chrome, Edge, Kiwi Browser etc..).
3. Open the [Time Farm Telegram Bot](https://t.me/TimeFarmCryptoBot?start=W4OyQGZM5rZK8r88).
4. Navigate to the **Network** tab.
5. Add a filter by clicking on the **filter** icon and selecting **Fetch/XHR**.
6. Search for `v2` and click on the first result.
7. In the **Response** or **Preview** tab, find the `token` and copy the value(started with `eyJ`).
8. Paste the copied value into `tokens.json` file.

> Video Version \
> https://github.com/user-attachments/assets/a08cfeb6-13bf-4878-94bc-29c247a7bbaa

## Running the Bot

After setting up the `tokens.json` file, you can run the bot with the following command:

```bash
npm start
```

Follow the instructions in the terminal to select your desired action. 

> Use [GNU screen](https://www.gnu.org/software/screen/) for a better experience when using `Loop Mode` features. 
---

## Contributing

Feel free to submit issues or create pull requests to improve the bot.

## Donate

If you find this project useful, consider donating to the project's maintainers:
- **TON**: `UQDoLQNF-nt9CFOHBs9mQqxH9YJKrZ6mFPbAeHH8Jo9xIGCb`
- **EVM**: `0xfD1847bFAA92fb8c0d100b207d377490C5acd34c`
- **SOL**: `BBZjp11sJNvekXZEBhhYDro9gsyyhEKXXcfEEub5ubje`

## License

This project is licensed under the MIT License.
