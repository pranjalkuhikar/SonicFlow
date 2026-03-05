import { useState } from "react";

const AddSongModal = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [songFile, setSongFile] = useState(null);

  const handleCoverChange = (event) => {
    setCoverImage(event.target.files?.[0] ?? null);
  };

  const handleSongChange = (event) => {
    setSongFile(event.target.files?.[0] ?? null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ title, artistName, coverImage, songFile });
    setTitle("");
    setArtistName("");
    setCoverImage(null);
    setSongFile(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-lg rounded-2xl bg-neutral-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Add New Song</h3>
          <button
            type="button"
            className="text-sm text-white/60 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-white/80 mb-1">Title</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Artist Name
            </label>
            <input
              className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              value={artistName}
              onChange={(event) => setArtistName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="w-full text-xs text-white/60"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Song File
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleSongChange}
              className="w-full text-xs text-white/60"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-lg border border-white/20 active:scale-95 px-4 py-2 text-sm hover:bg-white/10"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="rounded-lg bg-white px-4 py-2 text-sm active:scale-95 font-semibold text-black hover:bg-neutral-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongModal;
