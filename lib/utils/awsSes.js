
const nodemailer = require("nodemailer");
const ses = require("nodemailer-ses-transport");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const sesConfigs = require("config").get("clients.awsSesAuth");

const emailTemplateVerification = fs.readFileSync(
    path.join(__dirname, "MailTemplate", "verification.hbs"),
    "utf8"
);

const emailTemplateNotice = fs.readFileSync(
    path.join(__dirname, "MailTemplate", "customMessage.hbs"),
    "utf8"
);

const awsSesAuth = {
    accessKeyId: sesConfigs.accessKeyId,
    secretAccessKey: sesConfigs.secretAccessKey,
    region: sesConfigs.region,
};

const smtpTransport = nodemailer.createTransport(ses(awsSesAuth));

const sendVerificationCode = async (to, code) => {
    try {

        // let { to, code } = data;

        console.log("to ---->", to);
        console.log("code ---->", code);
        console.log(`send email to : ${to} code : ${code} from : ${sesConfigs.from}`)

        const verificationTemplate = handlebars.compile(emailTemplateVerification);

        const mailOptions = {
            to: `${to}`,
            from: `${sesConfigs.from}`,
            subject: `${sesConfigs.subjectVerification}`,
            html: await verificationTemplate({ code }),
        };

        let sendResponse = await smtpTransport.sendMail(mailOptions);
        console.log(sendResponse)

    } catch (error) {
        console.log(error)
        throw error;
    }

};

const sendEmpty = async (to, code, from) => {
    try {

        // let { to, code } = data;

        console.log("to ---->", to);
        console.log("code ---->", code);
        console.log(`send email to : ${to} code : ${code} from : ${sesConfigs.from}`)

        // const verificationTemplate = handlebars.compile(emailTemplateVerification);

        const mailOptions = {
            to: `${to}`,
            from,
            subject: `${sesConfigs.subjectVerification}`,
            html: `<html>${code}</html>`,
        };

        let sendResponse = await smtpTransport.sendMail(mailOptions);
        console.log(sendResponse)

    } catch (error) {
        console.log(error)
        throw error;
    }

};


const sendWithdrawCode = async (to, code) => {
    try {

        // let { to, code } = data;

        console.log("to ---->", to);
        console.log("code ---->", code);
        console.log(`send Withdraw email to : ${to} code : ${code} from : ${sesConfigs.from}`)

        const verificationTemplate = handlebars.compile(emailTemplateVerification);

        const mailOptions = {
            to: `${to}`,
            from: `${sesConfigs.from}`,
            subject: `${sesConfigs.subjectVerification}`,
            html: await verificationTemplate({ code }),
        };

        let sendResponse = await smtpTransport.sendMail(mailOptions);
        console.log(sendResponse)

    } catch (error) {
        console.log(error)
        throw error;
    }

};


const sendNoticeEmail = async (to, title, text) => {
    try {

        console.log("to ---->", to);
        console.log(`send notice email to : ${to} from : ${sesConfigs.from}`)

        const noticeTemplate = handlebars.compile(emailTemplateNotice);

        const mailOptions = {
            to: `${to}`,
            from: `${sesConfigs.from}`,
            subject: `${sesConfigs.subjectVerification}`,
            html: await noticeTemplate({ title, text }),
        };

        let sendResponse = await smtpTransport.sendMail(mailOptions);
        console.log(sendResponse)

    } catch (error) {
        console.log(error)
        throw error;
    }

};

module.exports = { sendVerificationCode, sendNoticeEmail, sendWithdrawCode, sendEmpty };
