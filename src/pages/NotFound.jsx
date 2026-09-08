import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center space-y-6 max-w-xl mx-auto my-8 animate-in fade-in duration-300">
      <div className="h-16 w-16 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-650 mx-auto shadow-sm">
        <ShieldAlert className="h-8 w-8 text-black" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Page Not Found</h1>
        <p className="text-sm text-zinc-500 max-w-xs mx-auto">
          The link you followed may be broken, or the page may have been removed.
        </p>
      </div>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl transition-all cursor-pointer text-xs shadow-sm"
      >
        Go to Home
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
