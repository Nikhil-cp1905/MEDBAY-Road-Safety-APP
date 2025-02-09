import emailjs from 'emailjs-com';

const SERVICE_ID = 'service_16sm2hc';
const TEMPLATE_ID = 'template_ib4fqze';
const USER_ID = 'CFdAl5Y0VoD27A-4k';

export const sendAlertEmail = (alertDetails) => {
  const templateParams = {
    alert_type: alertDetails.type,
    alert_location: alertDetails.location,
    alert_details: alertDetails.details,
    recipient_email: alertDetails.recipientEmail,
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
};

