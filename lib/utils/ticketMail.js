const sendgridConfig = require("config").get("clients.sendgrid");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(sendgridConfig.auth.api_user);

module.exports = async (to, ticketCode, ticketLink) => {
    const templateId = "d-ba2fed40ebd74d6aa52041158b737502";

    const data = { ticketCode, ticketLink };

    const msg = {
        to: to,
        from: sendgridConfig.from,
        templateId,
        dynamic_template_data: data
    };

    return sgMail
        .send(msg)
        .then((response) => {
        })
        .catch((error) => {
            console.error("email", error);
        });
};
