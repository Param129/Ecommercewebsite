const nodemailer=require("nodemailer");

const sendEmail = async(options)=> {
    //in options we got email,message,subject
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
           user:process.env.SMTP_MAIL,
           pass:process.env.SMTP_PASSWORD, 
        }
    })

    const mailoptions={
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

   await transporter.sendMail(mailoptions);
}


module.exports=sendEmail;