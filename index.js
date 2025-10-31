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
      'https://script.google.com/macros/s/AKfycbw0uF46ZLeb4wdcYAs9E0EP22fq-21eXXrBW7MmLHMh5KmeK0uoKAyYWR4EZqaXAX4/exec',
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

