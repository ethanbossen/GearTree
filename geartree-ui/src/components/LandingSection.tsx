import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import shuffleIcon from "../assets/arrows-shuffle.svg";
import mastodonStudio from "../assets/MastodonStudio2.png";
import { Artists } from "../api";
import type { Artist } from "../api";

export function LandingSection() {
  const [artistIds, setArtistIds] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    Artists.list().then((artists: Artist[]) => {
      setArtistIds(artists.map((a) => a.id));
    });
  }, []);

  const handleRandomClick = () => {
    if (artistIds.length === 0) return;

    const randomId = artistIds[Math.floor(Math.random() * artistIds.length)];
    navigate(`/artists/${randomId}`);
  };

  return (
    <main className="pl-[8%] pr-10 pt-10 pb-10 min-h-screen flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Classic Rigs, Classic Tone.</h1>
      <h3 className="text-lg max-w-xl">
        Welcome to GearTree, a digital exploration of artist rigs and the
        essentials you need to replicate classic tones from exceptional
        guitarists.
      </h3>

      <button
        onClick={handleRandomClick}
        className="w-40 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
      >
        Random Rig
        <img
          src={shuffleIcon}
          alt="Shuffle icon"
          className="w-5 h-5 invert brightness-0"
        />
      </button>

      <div className="flex justify-center">
        <div
          className="w-full rounded-lg overflow-hidden shadow-lg max-w-6xl"
          style={{ aspectRatio: "16 / 7" }}
        >
          <img
            src={mastodonStudio}
            alt="Mastodon in the studio, b+w image"
            className="w-full h-full object-cover blur-xs brightness-50"
            style={{
              objectPosition: "center top",
            }}
          />
        </div>
      </div>
    </main>
  );
}
