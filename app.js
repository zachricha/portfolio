require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false,
}));

let emailSuccess = null;

app.get('/', (req, res) => {
  res.render('index', {
    emailSuccess,
  });
  emailSuccess = null;
});

app.post('/send', (req, res) => {
  const emailOutput = `
    <p>New Contact Request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: `"Portfolio Contact" <${req.body.email}>`,
    to: process.env.EMAIL,
    subject: 'Portfolio Contact Request',
    text: '',
    html: emailOutput,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      emailSuccess = false;
      return res.redirect('/');
    };
    emailSuccess = true;
    return res.redirect('/')
  });
});

app.listen(port, () => {
  console.log(`Server starting on port ${port}`);
});
