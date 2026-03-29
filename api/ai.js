module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { system, prompt, max_tokens = 800 } = req.body;
    const models = ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022'];
    let lastErr = '';

    for (const model of models) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            max_tokens,
            system: system || 'You are a helpful assistant.',
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.content?.map(c => c.text || '').join('') || '';
          return res.status(200).json({ text });
        }
        lastErr = await response.text();
        console.error('Model', model, 'failed:', response.status, lastErr);
      } catch (e) {
        lastErr = e.message;
        console.error('Model', model, 'error:', e.message);
      }
    }
    return res.status(200).json({ text: '', error: lastErr });
  } catch (error) {
    console.error('AI proxy error:', error);
    res.status(500).json({ error: 'AI request failed', details: error.message });
  }
}
