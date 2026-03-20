import { Routes, Route, Link } from 'react-router-dom';
import Landing from './routes/Landing.jsx';
import Chat from './routes/Chat.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global header */}
      <header className="border-b border-slate-800 sticky top-0 z-10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl" role="img" aria-label="robot">&#x1F916;</span>
            <span className="font-bold text-lg tracking-tight">Macro</span>
          </Link>
          <nav className="flex gap-4 text-sm text-slate-400">
            <Link to="/" className="hover:text-slate-50 transition">Home</Link>
            <Link to="/chat" className="hover:text-slate-50 transition">Chat</Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  );
}
