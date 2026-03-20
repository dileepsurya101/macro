import fetch from 'node-fetch';
import { env } from '../config/env.js';

/**
 * Call an OpenAI-compatible Chat Completions endpoint.
 * @param {Array<{role:string, content:string}>} messages
 * @returns {Promise<string>} assistant reply text
 */
export async function getChatCompletion(messages) {
  if (!env.openaiKey || !env.openaiBaseUrl) {
    throw new Error('AI API not configured. Set OPENAI_API_KEY and OPENAI_API_BASE_URL.');
  }

  const res = await fetch(`${env.openaiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('AI API error', res.status, text);
    throw new Error('Failed to get AI response');
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
