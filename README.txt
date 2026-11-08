SMARTDAILY — Telegram orders on Vercel

1. In Vercel open the project that hosts smartdaily.vercel.app.
2. Settings -> Environment Variables:
   TELEGRAM_BOT_TOKEN = your bot token (enter it privately in Vercel)
   TELEGRAM_CHAT_ID = 353934036
3. In the deployed project replace the site page with this index.html.
4. Upload the api folder so the final path is api/order.js (at project root).
5. Redeploy the project.
6. Open the Telegram bot and send /start from the account/chat that should receive orders.
7. Submit a test order.

IMPORTANT:
- No Telegram token is included in index.html.
- The browser calls /api/order; the Vercel function sends the message to Telegram.
- Do not publish or send the bot token in chat. If it was exposed, revoke it in BotFather and use a fresh token in Vercel.
- The same bot and chat can receive orders from another Vercel site if that project also has the same environment variables and the /api/order function.
