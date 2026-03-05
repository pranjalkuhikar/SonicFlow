import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AvatarMenu from "./AvatarMenu";
import { selectAvatarColor, setAvatarColor } from "../features/ui/uiSlice";
import { getAvatarColor } from "../utils/avatarColors";

const HeaderActions = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const avatarColor = useSelector(selectAvatarColor);
  const fallbackColor = useMemo(() => getAvatarColor(), []);

  const handleArtistDashboard = () => {
    if (user?.user?.role === "artist") {
      navigate("/artist");
    }
  };

  useEffect(() => {
    if (user && !avatarColor) {
      dispatch(setAvatarColor(getAvatarColor()));
    }
  }, [dispatch, user, avatarColor]);

  return (
    <div className="flex w-full flex-col items-end gap-3 md:items-between">
      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          {user?.user?.role === "artist" && (
            <button
              type="button"
              onClick={handleArtistDashboard}
              className="rounded-lg bg-white active:scale-95 text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
            >
              Artist Dashboard
            </button>
          )}
        </div>
        {user ? (
          <AvatarMenu
            user={user.user}
            color={avatarColor ?? fallbackColor}
            onLogout={onLogout}
          />
        ) : (
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border active:scale-95 border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-white active:scale-95 text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
            >
              Register
            </Link>
          </nav>
        )}
      </div>

      <div className="flex justify-end gap-4 pb-4 md:hidden w-full">
        {user?.user?.role === "artist" && (
          <button
            type="button"
            onClick={handleArtistDashboard}
            className="rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200 w-full"
          >
            Artist Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderActions;
