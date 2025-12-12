export default async function handler(req, res) {
  console.log("Incoming request method:", req.method);
  console.log("Incoming request headers:", req.headers);
  console.log("Incoming request body:", req.body);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://bodymods.ca');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  // Handle POST requests
  if (req.method === 'POST') {
    try {
      // 1. Extract the reCAPTCHA token from the request body
      const token = req.body.recaptcha;

      if (!token) {
        res.setHeader('Access-Control-Allow-Origin', 'https://bodymods.ca');
        return res.status(400).send('Missing reCAPTCHA token');
      }

        // 2. Verify with Google using Secret Key
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY, // keep this in env
            response: token
          })
        });

        const verifyData = await verifyRes.json();
        console.log("reCAPTCHA verify result:", verifyData);

        if (!verifyData.success) {
          res.setHeader('Access-Control-Allow-Origin', 'https://bodymods.ca');
          return res.status(403).send('Failed reCAPTCHA verification');
        }

      // 3. If reCAPTCHA passes, forward to Google Apps Script
      const response = await fetch('https://script.google.com/macros/s/AKfycbyUTlPPjugJc6VO3gT4jJDvBMLyvma8dc2MTnTc7iSq9Jt77p8Ub1z4GpFrfXFZ9v7drw/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });

      const text = await response.text();

      res.setHeader('Access-Control-Allow-Origin', 'https://bodymods.ca');
      res.status(200).send(text);
    } catch (err) {
      res.setHeader('Access-Control-Allow-Origin', 'https://bodymods.ca');
      res.status(500).send('Proxy error: ' + err.message);
    }
  } else {
    // Reject other methods
    res.setHeader('Access-Control-Allow-Origin', 'https://bodymods.ca');
    res.status(405).send('Method Not Allowed');
  }
}
