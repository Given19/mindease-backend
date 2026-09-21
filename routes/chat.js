const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

const SYSTEM_PROMPT = `You are a warm, supportive check-in companion inside the MindEase mental health app.
The user has told you their current mood and something on their mind.
Respond with empathy, in 2-4 short sentences, like a caring friend or supportive counselor - not clinical or robotic.
You can ask one gentle follow-up question to help them reflect further, but not every time - sometimes just acknowledging what they said is enough.
Never diagnose, never give medical or clinical advice, and never claim to replace a real therapist.
If the user expresses thoughts of self-harm, suicide, or being in danger, respond with warmth, take it seriously, and gently encourage them to use the app's Crisis Resources page or contact a crisis line immediately, rather than continuing casual conversation.
Keep your tone calm, kind, and human.`;

router.post('/', async (req, res) => {
  try {
    const { mood, messages } = req.body;

    if (!mood || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'mood and messages are required.' });
    }

    const anthropicMessages = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 300,
        system: `${SYSTEM_PROMPT}\n\nThe user's current mood is: ${mood}.`,
        messages: anthropicMessages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(502).json({ message: 'AI service error.' });
    }

    const replyText = data.content
      ?.filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n') || "Thanks for sharing that with me.";

    res.json({ reply: replyText });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;