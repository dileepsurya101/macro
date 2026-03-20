/**
 * Build the messages array sent to the AI.
 * Combines system instructions, conversation history,
 * extracted file text, and optional web search summaries.
 */
export function buildPrompt({ messages, fileTexts = [], webSearchSummary = '' }) {
  const systemInstruction =
    'You are Macro, a helpful AI assistant. ' +
    'When file excerpts or web search summaries are provided, use them to give accurate, context-aware answers.';

  const contextParts = [];
  if (fileTexts.length) {
    contextParts.push('--- Attached file excerpts ---\n' + fileTexts.join('\n---\n'));
  }
  if (webSearchSummary) {
    contextParts.push('--- Web search summary ---\n' + webSearchSummary);
  }

  const systemContent =
    systemInstruction + (contextParts.length ? '\n\n' + contextParts.join('\n\n') : '');

  return [
    { role: 'system', content: systemContent },
    // Conversation history (user + assistant turns)
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];
}
