const http = require('http');
const nodemailer = require('nodemailer');

// create HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(200);
    res.end();
    return;
  }
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { subject, message } = JSON.parse(body);
      console.log(`Received data: subject=${subject}, message=${message}`);

      // send email using Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pytest100days@gmail.com',
          pass: 'pvhrcafiwqqossjj',
        },
      });
      const mailOptions = {
        from: 'pytest100days@gmail.com',
        to: 'eliacohen100@gmail.com',
        subject: subject,
        text: message,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal server error');
        } else {
          console.log(`Email sent: ${info.response}`);
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Email sent successfully');
        }
      });
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
});

// start server
const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
