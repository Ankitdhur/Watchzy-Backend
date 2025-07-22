const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();
const fs = require("fs");


async function updateTemplateHelper(templatePath, toReplaceObject) {
    let templateContent = await fs.promises.readFile(templatePath, "utf-8");
    const keyArrs = Object.keys(toReplaceObject);
    keyArrs.forEach((key) => {
        templateContent = templateContent.replace(`#{${key}}`, toReplaceObject[key]);
    })
    return templateContent;
}

async function emailSender(templatePath, recieverEmail, toReplaceObject) {
    console.log(process.env.GMAIL_USER, process.env.GMAIL_APP_PASSWORD);
    try {
        const content = await updateTemplateHelper(templatePath, toReplaceObject);
        // thorugh which service you have to send the mail 
        const gmailDetails = {
            service: "gmail", // This is enough; you don't need to specify host/port manually
            auth: {
                user: process.env.GMAIL_USER,  // Your Gmail address
                pass: process.env.GMAIL_APP_PASSWORD // App Password, not your Gmail password
            }
        };

        const msg = {
            to: recieverEmail,
            from: process.env.GMAIL_USER, // Change to your verified sender
            subject: 'Sending First Email',
            text: "",
            html: content,
        }
        const transporter = nodemailer.createTransport(gmailDetails);
        await transporter.sendMail(msg);
    } catch (err) {
        console.log("email not send because of the error", err);
    }
}

module.exports = emailSender;
// demo
// const toReplaceObject = {
//     name: "Jasbir",
//     otp: "1234"
// }

//  emailSender("./templates/otp.html", "jasbir.singh19906@gmail.com", toReplaceObject).then(()=>{
//     console.log("Email is send");
//  })





