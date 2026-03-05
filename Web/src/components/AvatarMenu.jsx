import { useState } from "react";
import Avatar from "./Avatar";

const AvatarMenu = ({ user, color, onLogout }) => {
  const [open, setOpen] = useState(false);
  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2"
        onClick={() => setOpen((o) => !o)}
      >
        <Avatar name={user.firstName} size="size-8" color={color} />
        <div className="hidden md:block text-left">
          <div className="text-sm">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-white/60">{user.email}</div>
        </div>
      </button>
      <div
        className={`absolute right-0 z-50 top-full mt-2 w-64 rounded-xl border border-white/10 bg-neutral-950/95 backdrop-blur shadow-2xl ${open ? "block" : "hidden"}`}
      >
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar name={user.firstName} size="size-10" color={color} />
            <div className="flex-1">
              <div className="text-sm">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-white/60">{user.email}</div>
            </div>
          </div>
          <div className="mt-3 h-px bg-white/10" />
          <div className="mt-3">
            <button
              type="button"
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarMenu;
