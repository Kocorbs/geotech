export async function sendSms(
  recipient: string,
  message: string,
  sender_id = "PhilSMS"
) {
  const token = process.env.NEXT_PUBLIC_PHILSMS_API_TOKEN;

  if (!token) {
    throw new Error("❌ Missing PHILSMS_API_TOKEN in .env file");
  }

  const send_data = {
    sender_id, // "PhilSMS", your approved name, or your phone number
    recipient, // e.g. "+639171234567"
    message, // text message content
  };

  try {
    const response = await fetch("https://app.philsms.com/api/v3/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(send_data),
    });

    const result = await response.json();

    if (result.status === "success") {
      console.log(`✅ SMS sent successfully to ${recipient}`);
    } else {
      console.error(`❌ Error sending SMS:`, result);
    }

    return result;
  } catch (error) {
    console.error("🚨 Request failed:", error);
    throw error;
  }
}

// Example usage:
// sendSms("+639811473152", "Hello from PhilSMS API!", "PhilSMS");
