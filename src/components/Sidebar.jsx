import { NavLink } from 'react-router-dom';

export default function Sidebar({ title, items = [] }) {
  return (
    <aside className="w-full lg:w-64 bg-white border border-zinc-200 rounded-3xl p-5 shrink-0 text-left shadow-sm">
      {title && (
        <div className="border-b border-zinc-100 pb-3 mb-4">
          <h2 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400">{title}</h2>
        </div>
      )}

      <ul className="space-y-1.5">
        {items.map((item, index) => {
          const Icon = item.icon;
          
          if (item.path) {
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent'
                    }`
                  }
                >
                  {Icon && <Icon className="h-4.5 w-4.5" />}
                  <span className="flex-grow">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-zinc-100 text-zinc-600 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          }

          return (
            <li key={index}>
              <button
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-all duration-200 border cursor-pointer ${
                  item.isActive
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border-transparent'
                }`}
              >
                {Icon && <Icon className="h-4.5 w-4.5" />}
                <span className="flex-grow">{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${item.isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
