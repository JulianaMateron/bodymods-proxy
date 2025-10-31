export default async function handler(req, res) {
    console.log("🔍 Incoming request method:", req.method);
  console.log("📦 Incoming request headers:", req.headers);
  console.log("🧾 Incoming request body:", req.body);
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Forward the JSON payload to your Apps Script endpoint
    const response = await fetch('https://script.google.com/macros/s/AKfycbz_fycElHV6eVBTd_Gg0EHHSC2mHJ8Eu3SQ37wxDGexpgoGuN2_kMRUFqnuVEPpzRoH/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.text();
    res.status(200).send(result);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy forwarding failed');
  }
}
