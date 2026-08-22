const MAX_SESSIONS = 500;
const MAX_MESSAGES = 12;
const sessions = new Map();

const cleanMessage = (message) => ({
  role: message.role === "assistant" ? "assistant" : "user",
  content: String(message.content || "").slice(0, 4000),
});

export const getConversation = (sessionId) => sessions.get(sessionId) || [];

export const appendConversation = (sessionId, messages) => {
  const current = getConversation(sessionId);
  const next = [...current, ...messages.map(cleanMessage)].slice(-MAX_MESSAGES);
  sessions.set(sessionId, next);

  if (sessions.size > MAX_SESSIONS) {
    sessions.delete(sessions.keys().next().value);
  }

  return next;
};

export const conversationLimits = { MAX_MESSAGES, MAX_SESSIONS };
