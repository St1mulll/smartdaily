// Vercel Serverless Function: /api/order
// Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel → Project Settings → Environment Variables.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Missing Telegram environment variables");
      return res.status(500).json({ ok: false, error: "Server is not configured" });
    }

    const { name, phone, model, price, site } = req.body || {};
    if (
      typeof name !== "string" || !name.trim() ||
      typeof phone !== "string" || !phone.trim()
    ) {
      return res.status(400).json({ ok: false, error: "Name and phone are required" });
    }

    const clean = (value, max = 300) =>
      String(value ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

    const message = [
      "🛒 НОВЕ ЗАМОВЛЕННЯ",
      "",
      `🌐 Сайт: ${clean(site || "SmartDaily", 120)}`,
      `📦 Модель: ${clean(model || "не вказано", 120)}`,
      `💰 Ціна: ${clean(price || "не вказана", 30)} грн`,
      `👤 Ім'я: ${clean(name, 120)}`,
      `📞 Телефон: ${clean(phone, 60)}`,
      `⏰ Час: ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`
    ].join("\n");

    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    const tgData = await tgResponse.json();
    if (!tgResponse.ok || !tgData.ok) {
      console.error("Telegram API error:", tgData);
      return res.status(502).json({ ok: false, error: "Telegram did not accept the order" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Order API error:", error);
    return res.status(500).json({ ok: false, error: "Could not send order" });
  }
}
