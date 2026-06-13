import { Link } from 'react-router';
import { Building2, Bell, LogOut, LucideIcon } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface PortalNavProps {
  portal: string;
  portalColor?: string;
  userName?: string;
  userMeta?: string;
  avatar?: string;
  links?: NavLink[];
  homeHref?: string;
}

export default function PortalNav({
  portal,
  portalColor = 'text-indigo-500',
  userName = 'User',
  userMeta,
  avatar = 'U',
  links = [],
  homeHref = '/',
}: PortalNavProps) {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={homeHref} className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <p className="font-bold text-gray-900 text-sm">HostelIQ</p>
              <p className={`text-xs font-medium ${portalColor}`}>{portal}</p>
            </div>
          </Link>
          {links.length > 0 && (
            <div className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {avatar}
            </div>
            <div className="hidden sm:block leading-none">
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
              {userMeta && <p className="text-xs text-gray-400">{userMeta}</p>}
            </div>
          </div>
          <Link to="/" className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Exit">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
