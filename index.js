const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/submit', async (req, res) => {
  try {
    const response = await axios.post(
      'https://script.google.com/macros/s/AKfycbwA3TeLHuBwuhoX1gUxNOarzJmOTc7gs_5M14mU5UjpJoGHtbMGeYFFhFzj2ab1FRf9/exec',
      req.body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.send(response.data);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
