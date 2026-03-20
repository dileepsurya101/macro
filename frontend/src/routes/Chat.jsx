import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || '';

// Single message bubble
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <span className="text-xl mr-2 self-end" role="img" aria-label="robot">&#x1F916;</span>
      )}
      <div
        className={`max-w-xl px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-500 text-white rounded-br-none'
            : 'bg-slate-800 text-slate-100 rounded-bl-none'
        }`}
      >
        <div className="whitespace-pre-wrap">{msg.content}</div>
      </div>
    </div>
  );
}

export default function Chat() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [attachedFileIds, setAttachedFileIds] = useState([]);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  // Load conversation from URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cid = params.get('c');
    if (cid) {
      setConversationId(cid);
      axios
        .get(`${API}/api/conversations/${cid}`)
        .then((res) => setMessages(res.data.messages || []))
        .catch(() => {});
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pending]);

  const handleSend = async () => {
    if (!input.trim() || pending) return;
    setError('');
    setPending(true);

    try {
      let cid = conversationId;
      let fileIds = [...attachedFileIds];

      // Upload any selected files first (needs an existing conversationId)
      // For first message: create conv via chat, then upload on next message
      if (selectedFiles.length && cid) {
        const fd = new FormData();
        fd.append('conversationId', cid);
        selectedFiles.forEach((f) => fd.append('files', f));
        const up = await axios.post(`${API}/api/upload`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const newIds = up.data.files.map((f) => f.id);
        fileIds = [...fileIds, ...newIds];
        setAttachedFileIds(fileIds);
        setSelectedFiles([]);
      }

      // Send message to backend
      const res = await axios.post(`${API}/api/chat`, {
        conversationId: cid,
        message: input.trim(),
        fileIds,
        useWebSearch,
      });

      // If new conversation, update URL
      if (!cid) {
        const newCid = res.data.conversationId;
        setConversationId(newCid);
        window.history.replaceState(null, '', `/chat?c=${newCid}`);
      }

      setMessages((prev) => [...prev, ...res.data.messages]);
      setInput('');
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] max-w-5xl mx-auto w-full px-4 py-4">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto chat-scroll border border-slate-800 rounded-2xl p-4 bg-slate-900 mb-4">
        {messages.length === 0 && !pending && (
          <p className="text-slate-500 text-sm text-center mt-8">
            &#x1F916; Start a conversation with Macro!
          </p>
        )}
        {messages.map((m, i) => (
          <Bubble key={m._id || i} msg={m} />
        ))}
        {pending && (
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-75" />
            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse delay-150" />
            <span className="ml-1">Macro is thinking&hellip;</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-2 px-4 py-2 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="space-y-2">
        {/* Toggles row */}
        <div className="flex items-center justify-between gap-3">
          {/* Web search toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useWebSearch}
              onChange={(e) => setUseWebSearch(e.target.checked)}
              className="accent-indigo-500"
            />
            <span>&#x1F310; Use web search</span>
          </label>

          {/* File picker */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
            />
            <span className="px-3 py-1 border border-slate-700 hover:border-indigo-500 rounded-full transition">
              &#x1F4CE; Attach files
            </span>
            {selectedFiles.length > 0 && (
              <span className="text-indigo-400">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} ready
              </span>
            )}
          </label>
        </div>

        {/* Text input + send */}
        <div className="flex items-end gap-2">
          <textarea
            rows={3}
            className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Ask Macro anything… (Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={pending || !input.trim()}
            className="h-12 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
          >
            {pending ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
