import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home as HomeIcon,
  LibraryBig,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import Search from "./Search";
import HeaderActions from "./HeaderActions";

const baseNavItems = [
  { label: "Home", to: "/", icon: HomeIcon },
  { label: "Library", to: "/library", icon: LibraryBig },
];

const SidebarLayout = ({
  user,
  onLogout,
  title,
  subtitle,
  showSearch = false,
  headerExtras,
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = user?.user?.role;

  const items = useMemo(() => {
    const list = [...baseNavItems];
    if (role === "artist") {
      list.push({
        label: "Artist Dashboard",
        to: "/artist",
        icon: LayoutDashboard,
      });
    }
    return list;
  }, [role]);

  const renderNav = (className) => (
    <aside className={className}>
      <div className="flex h-full flex-col items-center gap-8">
        <div className="w-48 flex flex-col gap-4">
          <Logo />
          <nav className="mx-auto flex w-full mt-10 max-w-[320px] flex-col gap-3">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full"
                >
                  {({ isActive }) => (
                    <div
                      className={`relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition min-h-[64px] ${
                        isActive
                          ? "bg-white text-black shadow-[0_10px_40px_rgba(255,255,255,0.08)]"
                          : "bg-gradient-to-r from-white/[0.08] to-white/[0.03] text-white hover:from-white/15 hover:to-white/7"
                      }`}
                    >
                      <span
                        className={`flex size-9 items-center justify-center rounded-xl border border-white/10 ${
                          isActive
                            ? "bg-black/5 text-black"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-semibold">{item.label}</span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto w-full space-y-3">
          <HeaderActions
            user={user}
            showArtistButton={false}
            showHomeButton={false}
          />
          {user && (
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {renderNav(
        "fixed left-0 top-0 z-30 hidden h-screen w-[280px] overflow-y-auto overflow-x-hidden border-r border-white/5 bg-[#080808] px-6 py-8 md:flex",
      )}

      <div className="flex min-h-screen flex-1 flex-col md:pl-[280px]">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-4 md:hidden">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg border border-white/10 bg-white/10 p-2"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <Logo compact />
          <HeaderActions
            user={user}
            onLogout={onLogout}
            showArtistButton={false}
            showHomeButton={false}
          />
        </div>

        {mobileOpen && (
          <div className="md:hidden">
            {renderNav(
              "fixed left-0 top-14 z-40 h-[calc(100vh-56px)] w-72 overflow-y-auto border-r border-white/5 bg-[#0b0b0b] px-5 py-6 shadow-2xl",
            )}
            <div
              className="fixed inset-0 z-30 bg-black/60"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
          </div>
        )}

        <main className="flex-1 w-full px-4 pb-16 pt-6 sm:px-6 md:px-10 lg:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              {title && (
                <h1 className="text-3xl font-semibold leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm text-white/60">{subtitle}</p>
              )}
            </div>
            <div className="hidden md:flex items-center gap-3">
              {headerExtras}
            </div>
          </div>

          {showSearch && (
            <div className="mt-6">
              <Search />
            </div>
          )}

          <div className="mt-6 md:hidden flex items-center gap-3">
            {headerExtras}
          </div>

          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
