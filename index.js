const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs'); // Add this line

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/submit', async (req, res) => {
  try {
    const formData = qs.stringify(req.body); // Convert to URL-encoded

    const response = await axios.post(
      'https://script.google.com/macros/s/AKfycbysdtoIkPcyo7EA_od7IuJY38-XqBQqmOTcu754vlqaBx7A7GlL0i53imS0C7vmgN6Q/exec',
      formData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    res.send(response.data);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

