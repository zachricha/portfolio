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
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index', {
    emailSuccess: undefined,
  });
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
    host: 'mail.smtp2go.com',
    port: 2525,
    secure: false,
    auth: {
      user: 'zrricha1@gmail.com',
      pass: 'VNpa9qSunCGr',
    },
  });

  let mailOptions = {
    from: '"Portfolio Contact" <portfolio@zachrichards.com>',
    to: 'zrricha1@gmail.com',
    subject: 'Portfolio Contact Request',
    text: '',
    html: emailOutput,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.render('index', {
        emailSuccess: false,
      });
      return;
    }

    res.render('index', {
      emailSuccess: true,
    });

  });
});

app.listen(port, () => {
  console.log('server started on port 3000');
});
