export default async function handler(req, res) {
  // Set CORS headers once at the top
  res.setHeader('Access-Control-Allow-Origin', 'https://bodymods.ca');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    try {
      // FORWARD DATA TO GOOGLE APPS SCRIPT
      const response = await fetch('https://script.google.com/macros/s/AKfycbxsjzwq4b9gz2CzDAcsCIyXBvYfq3rAjOft0oB_zx7YO6ADXPECRH7vCYwqfZWc996Q/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });

      const text = await response.text();
      res.status(200).send(text);
    } catch (err) {
      res.status(500).send('Proxy error: ' + err.message);
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}