import { useMemo } from "react";

const colors = [
  "bg-pink-500",
  "bg-purple-600",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-sky-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-fuchsia-500",
];

const Avatar = ({ name = "", size = "size-8", color }) => {
  const initial = name ? name[0] : " ";
  const colorIndex = useMemo(() => {
    const base = name ? name.charCodeAt(0) : 0;
    return base % colors.length;
  }, [name]);
  const colorClass = color || colors[colorIndex];
  return (
    <div
      className={`${size} rounded-full ${colorClass} flex items-center justify-center font-semibold`}
    >
      {initial}
    </div>
  );
};

export default Avatar;
