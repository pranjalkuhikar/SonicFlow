import { useState } from "react";
import { useSearchSongsQuery } from "../services/songApi";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const trimmedTerm = searchTerm.trim();
  const shouldQuery = trimmedTerm.length > 0;

  const { data, isFetching, isError } = useSearchSongsQuery(trimmedTerm, {
    skip: !shouldQuery,
  });

  const searchResults = data?.songs ?? [];

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder="Search songs, artists, or albums"
        className="w-full rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm text-white outline-none placeholder:text-white/60 focus:border-white/80"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      {shouldQuery && (
        <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-2xl border border-white/10 bg-neutral-950/90 p-3 shadow-xl backdrop-blur-xl">
          {isFetching && (
            <div className="text-xs uppercase tracking-wider text-white/60">
              Searching…
            </div>
          )}
          {!isFetching && isError && (
            <div className="text-xs uppercase tracking-wide text-rose-400">
              Unable to load results.
            </div>
          )}
          {!isFetching && !isError && searchResults.length === 0 && (
            <div className="text-xs uppercase tracking-wide text-white/60">
              No results for “{trimmedTerm}”.
            </div>
          )}
          {!isFetching && !isError && searchResults.length > 0 && (
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {searchResults.slice(0, 6).map((song) => (
                <div
                  key={song._id}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-2 transition hover:border-white/40"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                    <img
                      src={song.coverImage.url}
                      alt={song.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-[13px] overflow-hidden">
                    <div className="font-semibold text-white truncate">
                      {song.title}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-white/50">
                      {song.artist}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
