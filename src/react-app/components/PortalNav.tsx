import { Link, useLocation, useNavigate } from 'react-router';
import { Bell, LogOut, LucideIcon } from 'lucide-react';
import { HostelIQLogoMark } from '@/react-app/components/HostelIQLogo';
import { logoutSession } from '@/react-app/hooks/useAuth';

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

function isNavLinkActive(href: string, pathname: string, search: string): boolean {
  const [path, query] = href.split('?');
  if (pathname !== path) return false;
  if (query) {
    const normalized = query.startsWith('?') ? query.slice(1) : query;
    return search.includes(normalized);
  }
  return true;
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
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    void logoutSession();
    navigate('/login');
  }

  const iconBtnClass = dark
    ? 'text-[#D1DEE6] hover:text-[#F8FAFC] hover:bg-white/8'
    : 'text-[#374151] hover:text-[#071B34] hover:bg-[#071B34]/5';

  const linkClass = (href: string) => {
    const active = isNavLinkActive(href, pathname, search);
    if (dark) {
      return active
        ? 'text-[#4CC9F0] bg-[#4CC9F0]/12 ring-1 ring-[#4CC9F0]/30 shadow-sm'
        : 'text-[#D1DEE6] hover:text-[#F8FAFC] hover:bg-white/8';
    }
    return active
      ? 'text-[#1B4F72] bg-[#071B34]/7 ring-1 ring-[#1B4F72]/15'
      : 'text-[#374151] hover:text-[#071B34] hover:bg-[#071B34]/5';
  };

  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        dark ? 'bg-[#071B34]/95 border-white/8' : 'bg-[#F5F7FA]/95 border-[#071B34]/8'
      }`}
      aria-label="Portal navigation"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={homeHref} className="flex items-center gap-3 group">
            <HostelIQLogoMark />
            <div className="leading-tight">
              <p className={`font-semibold text-sm tracking-tight ${dark ? 'text-[#F8FAFC]' : 'text-[#071B34]'}`}>
                HostelIQ
              </p>
              <p
                className={`text-[11px] uppercase tracking-widest font-semibold ${
                  dark ? 'text-[#D1DEE6]' : 'text-[#1B4F72]'
                }`}
              >
                {portal}
              </p>
            </div>
          </Link>
          {links.length > 0 && (
            <div className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Portal sections">
              {links.map((l) => {
                const active = isNavLinkActive(l.href, pathname, search);
                return (
                  <Link
                    key={l.href}
                    to={l.href}
                    aria-current={active ? 'page' : undefined}
                    className={`text-sm px-3 py-2 rounded-lg transition-all font-semibold ${linkClass(l.href)}`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`relative p-2 rounded-lg transition-colors ${iconBtnClass}`}
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#4CC9F0] rounded-full" aria-hidden="true" />
          </button>
          <div className={`flex items-center gap-3 pl-3 border-l ${dark ? 'border-white/12' : 'border-[#071B34]/10'}`}>
            <div className="w-8 h-8 bg-[#1B4F72] rounded-full flex items-center justify-center text-[#F8FAFC] text-xs font-semibold">
              {avatar}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className={`text-sm font-semibold ${dark ? 'text-[#F8FAFC]' : 'text-[#071B34]'}`}>{userName}</p>
              {userMeta && (
                <p className={`text-[11px] font-medium ${dark ? 'text-[#D1DEE6]' : 'text-[#374151]'}`}>{userMeta}</p>
              )}
            </div>
          </div>
          <Link to="/login" onClick={handleLogout} className={`p-2 rounded-lg transition-colors ${iconBtnClass}`} title="Logout" aria-label="Logout">
            <LogOut className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
