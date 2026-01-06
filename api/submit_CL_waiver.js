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
      const response = await fetch('https://script.google.com/macros/s/AKfycbwg5k_4ukRV_AKYOrs6vxZ72YsuVtVrWrAd3o6-RNU5yOStarJk6X0RQ1556zH8Y0JC3Q/exec', {
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
