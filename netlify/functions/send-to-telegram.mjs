export default async (request) => {
  if (request.method !== "POST") {
    return Response.json(
      { ok: false, error: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    const data = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram environment variables are missing");

      return Response.json(
        { ok: false, error: "Telegram settings are missing" },
        { status: 500 }
      );
    }

    const message = [
      "📩 رسالة جديدة من الموقع",
      "",
      `الإجراء: ${data.action || "ضغط زر"}`,
      `الاسم: ${data.name || "-"}`,
      `الهاتف: ${data.phone || "-"}`,
      `البريد الإلكتروني: ${data.email || "-"}`
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram error:", telegramResult);

      return Response.json(
        {
          ok: false,
          error: telegramResult.description || "Telegram rejected the message"
        },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Function error:", error);

    return Response.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
};

export const config = {
  path: "/api/send-to-telegram"
};
