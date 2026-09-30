export default function Loader({ fullscreen = true, message = 'Loading premium tech...' }) {
  if (!fullscreen) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-200" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#0071e3] border-r-[#0071e3] animate-spin" />
        </div>
        {message && <p className="text-xs text-zinc-500 font-semibold">{message}</p>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md space-y-4">
      {/* Spinning glow ring */}
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-200" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#0071e3] border-r-[#0071e3] animate-spin" />
      </div>
      
      {message && (
        <p className="text-sm font-semibold tracking-wide text-zinc-800 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
