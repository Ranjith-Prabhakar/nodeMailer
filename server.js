const express = require('express')
const nodeMailer = require('nodemailer')
const randomString = require('randomstring')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.set('view engine', "ejs")


let randomOtp = ''

app.get('/', (req, res) => {
    res.render('signUp')
}
)

app.post('/user/signup', (req, res) => {
    // Create a Nodemailer transporter
    let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.nodeMailerEmail,
            pass: process.env.nodeMailerEmailPassword
        }
    })

    // Generate a random OTP
    const otp = randomString.generate({
        length: 6,
        charset: 'numeric',
    });

    randomOtp = otp

    // Define the email content
    const mailOptions = {
        from: process.env.nodeMailerEmail, // Sender email
        to: req.body.email, // Recipient email
        subject: 'OTP Verification Code',
        text: `Your OTP is: ${otp}`,
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            res.render('otp')
        }
    });
}
)

app.post("/user/otp",(req,res)=>{
    if(randomOtp === req.body.otp){
        res.send('success')
    }
})
app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))
