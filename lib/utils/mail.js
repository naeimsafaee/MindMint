// const sendgridConfig = require("config").get("clients.sendgrid");
// const sgMail = require("@sendgrid/mail");


// sgMail.setApiKey(sendgridConfig.auth.api_user);

// /**
//  *
//  * @param {*} to string
//  * @param {*} code integer
//  * @param {*} type string
//  * @param {*} data object
//  * @returns
//  */
// module.exports = async (to, code, type, data = {}) => {
//     let templateId = "d-c756309a5e0647658db2d4d3f150748f";


//     if (type === "WITHDRAW")
//         templateId = "d-b9b9fd40052f408b9b23330a8a7f08b7";

//     if (type === "NOTICES")
//         templateId = "d-1399215f031f4f2a89f90507a2d4b227";

//     if (type === "NOTICES_CARD_PURCHASE")
//         templateId = "d-a061e90da2744feb929fc22c4938d858";

//     if (code) data = { customCode: code };

//     const msg = {
//         to: to,
//         from: sendgridConfig.from,
//         templateId,
//         dynamic_template_data: data
//     };
//     return sgMail
//         .send(msg)
//         .then((response) => {
//         })
//         .catch((error) => {
//             console.error("email", error);
//             console.log(error.response.body.errors)
//             console.log(error.body.errors)
//             console.log(error.errors)
//         });
// };


const sendgridConfig = require("config").get("clients.sendgrid");
const sgMail = require("@sendgrid/mail");
const { stringify } = require("uuid");
sgMail.setApiKey(sendgridConfig.auth.api_user);
const awsSes = require('./awsSes')

/**
 *
 * @param {*} to string
 * @param {*} code integer
 * @param {*} type string
 * @param {*} data object
 * @returns
 */

module.exports = async (to, code, type, data = {}) => {
    let templateId = sendgridConfig.templateId;

    // if (type === "WITHDRAW") templateId = sendgridConfig.templateId_WITHDRAW;

    // if (type === "NOTICES") templateId = sendgridConfig.templateId_NOTICES;

    if (code) data = { customCode: code };

    if (code && !type) {
        return awsSes.sendVerificationCode(to, code)
    }

    if (type === "NOTICES") {
        return awsSes.sendNoticeEmail(to, data.title, data.text)
    }

    if (type === "WITHDRAW") {
        if (code)
            return awsSes.sendWithdrawCode(to, code)
    }

    //sendGrid

    const msg = {
        to: to,
        from: sendgridConfig.from,
        templateId,
        dynamic_template_data: data,
    };

    return sgMail
        .send(msg)
        .then((response) => {
            // console.log("email response is : ");
            // console.log("email", response[0].statusCode);
        })
        .catch((error) => {
            console.log("email err is : ");
            console.error("email", error);
        });
};
