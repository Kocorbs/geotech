export async function sendSms(
  recipient: string,
  message: string,
  sender_id = "PhilSMS"
) {
  const token = process.env.NEXT_PUBLIC_PHILSMS_API_TOKEN;

  if (!token) {
    throw new Error("❌ Missing NEXT_PUBLIC_PHILSMS_API_TOKEN in .env file");
  }

  // ✅ FIX: PhilSMS expects recipient *without +*, type, and plain text message
  const send_data = {
    recipient: recipient.replace(/^\+/, ""), // e.g. 639171234567
    sender_id, // must be approved sender ID
    type: "plain",
    message,
  };

  try {
    const response = await fetch("https://app.philsms.com/api/v3/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(send_data),
    });

    const result = await response.json();

    if (result.status === "success") {
      console.log(`✅ SMS sent successfully to ${recipient}`);
    } else {
      console.error(`❌ SMS sending failed:`, result.message || result);
    }

    return result;
  } catch (error) {
    console.error("🚨 Request failed:", error);
    throw error;
  }
}
