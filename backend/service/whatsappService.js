import client from "../config/twilio.js";

export const sendWhatsAppMessage = async (
    to,
    message
) => {
    return await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:+91${to}`,
        body: message
    });
};