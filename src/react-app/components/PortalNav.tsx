import { Link } from 'react-router';
import { Building2, Bell, LogOut, LucideIcon } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface PortalNavProps {
  portal: string;
  userName?: string;
  userMeta?: string;
  avatar?: string;
  links?: NavLink[];
  homeHref?: string;
  dark?: boolean;
}

export default function PortalNav({
  portal,
  userName = 'User',
  userMeta,
  avatar = 'U',
  links = [],
  homeHref = '/',
  dark = false,
}: PortalNavProps) {
  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${dark ? 'bg-[#071B34]/90 border-white/5' : 'bg-[#F5F7FA]/90 border-[#071B34]/5'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={homeHref} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0A2342] rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#4CC9F0]" />
            </div>
            <div className="leading-tight">
              <p className={`font-semibold text-sm tracking-tight ${dark ? 'text-[#F8FAFC]' : 'text-[#071B34]'}`}>HostelIQ</p>
              <p className="text-[11px] text-[#4A5568] uppercase tracking-widest font-medium">{portal}</p>
            </div>
          </Link>
          {links.length > 0 && (
            <div className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className={`text-sm px-3 py-1.5 rounded-md transition-colors font-semibold ${dark ? 'text-[#C5D0D8] hover:text-[#F8FAFC]' : 'text-[#4A5568] hover:text-[#071B34]'}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button className={`relative p-2 rounded-md transition-colors ${dark ? 'text-[#4A5568] hover:text-[#F8FAFC]' : 'text-[#4A5568] hover:text-[#071B34]'}`}>
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#4CC9F0] rounded-full" />
          </button>
          <div className={`flex items-center gap-3 pl-4 border-l ${dark ? 'border-white/10' : 'border-[#071B34]/8'}`}>
            <div className="w-8 h-8 bg-[#1B4F72] rounded-full flex items-center justify-center text-[#F8FAFC] text-xs font-medium">
              {avatar}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className={`text-sm font-medium ${dark ? 'text-[#F8FAFC]' : 'text-[#071B34]'}`}>{userName}</p>
              {userMeta && <p className="text-[11px] text-[#4A5568]">{userMeta}</p>}
            </div>
          </div>
          <Link to="/" className={`p-2 rounded-md transition-colors ${dark ? 'text-[#4A5568] hover:text-[#F8FAFC]' : 'text-[#4A5568] hover:text-[#071B34]'}`} title="Exit">
            <LogOut className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
