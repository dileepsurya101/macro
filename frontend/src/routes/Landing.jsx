import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 flex flex-col md:flex-row items-center gap-12">
      {/* Left: Hero copy */}
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Meet <span className="text-indigo-400">Macro</span> &mdash; your AI assistant
          for files and the web
        </h1>
        <p className="text-slate-300 text-lg">
          Ask anything, upload your documents, and let Macro search the web to give
          you the most accurate, up&#x2011;to&#x2011;date answers.
        </p>
        <button
          onClick={() => navigate('/chat')}
          className="px-8 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold text-base shadow-lg transition"
        >
          Start chatting &rarr;
        </button>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 pt-2">
          {['Chat with AI', 'Upload PDF / DOCX / TXT', 'Web search toggle'].map((f) => (
            <span
              key={f}
              className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Robot illustration */}
      <div className="flex-shrink-0 flex flex-col items-center gap-4">
        <div className="relative">
          {/* Glowing circle behind robot */}
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-indigo-600/20 blur-2xl absolute inset-0 scale-110" />
          <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-2xl">
            <span className="text-7xl md:text-8xl select-none" role="img" aria-label="robot">&#x1F916;</span>
          </div>
        </div>
        {/* Chat bubble */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl rounded-tl-none px-5 py-3 shadow-lg max-w-xs">
          <p className="text-sm text-slate-200">
            Hi! I&apos;m Macro. Ask me anything or upload a file to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
