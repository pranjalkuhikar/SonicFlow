export const avatarPalette = [
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

export const getAvatarColor = () => {
  return avatarPalette[Math.floor(Math.random() * avatarPalette.length)];
};
