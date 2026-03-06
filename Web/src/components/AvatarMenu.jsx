import Avatar from "./Avatar";

const AvatarMenu = ({ user, color, onLogout }) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2">
      <Avatar name={user.firstName} size="size-8" color={color} />
      <div className="hidden md:block text-left">
        <div className="text-sm">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-white/60">{user.email}</div>
      </div>
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="ml-auto rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default AvatarMenu;
