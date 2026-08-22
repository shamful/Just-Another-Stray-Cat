const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Set your active provider here: 'local' | 'groq' | 'openrouter'
const PROVIDER = 'openrouter';

const ENDPOINTS = {
  local: 'http://localhost:11434/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions'
};

app.post('/api/chat', async (req, res) => {
  try {
    const headers = { 'Content-Type': 'application/json' };

    // Configure headers per provider cleanly without commenting out code
    if (PROVIDER === 'groq') {
      headers['Authorization'] = `Bearer ${process.env.GROQ_API_KEY}`;
    } else if (PROVIDER === 'openrouter') {
      headers['Authorization'] = `Bearer ${process.env.OPENROUTER_API_KEY}`;
      headers['HTTP-Referer'] = 'http://localhost:8000';
      headers['X-Title'] = 'Just Another Stray Cat';
    }

    const response = await fetch(ENDPOINTS[PROVIDER], {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });

    // Safely parse text first to prevent crash if upstream returns HTML errors
    const rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(response.status).send(rawText);
    }

    if (!response.ok) {
      console.error('API Error details:', JSON.stringify(data, null, 2));
      return res.status(response.status).json(data);
    }

    // Auto-strip leading/trailing square brackets from agent choices
    if (data.choices?.[0]?.message?.content) {
      data.choices[0].message.content = data.choices[0].message.content.replace(/^\[\s*|\s*\]$/g, '');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log(`Proxy server running on http://localhost:3000 (Provider: ${PROVIDER.toUpperCase()})`);
});