const sendSMS = async (phoneNumber, message) => {
  // Twilio or other SMS provider logic

  console.log(`SMS sent to ${phoneNumber}: ${message}`);
};

module.exports = {
  sendSMS
};