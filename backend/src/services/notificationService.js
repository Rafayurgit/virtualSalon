// Lightweight notification service stub for SMS/WhatsApp
export const sendSMS = async (to, message) => {
  // placeholder: integrate Twilio or an SMS provider later
  console.log(`SMS to ${to}: ${message}`);
  return true;
};

export const sendWhatsApp = async (to, message) => {
  // placeholder for WhatsApp integration
  console.log(`WhatsApp to ${to}: ${message}`);
  return true;
};
