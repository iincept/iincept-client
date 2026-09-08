export default function Loader({ fullscreen = true, message = 'Loading premium tech...' }) {
  if (!fullscreen) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 border-r-fuchsia-500 animate-spin" />
        </div>
        {message && <p className="text-xs text-slate-500 font-semibold">{message}</p>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md space-y-4">
      {/* Spinning glow ring */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
        <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-fuchsia-500 animate-spin shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
      </div>
      
      {message && (
        <p className="text-sm font-semibold tracking-wide bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
