import shuffleIcon from "../assets/arrows-shuffle.svg";

export function LandingSection() {
  return (
    <main className="pl-[8%] pr-10 pt-10 pb-20 min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold mb-4">Classic Rigs, Classic Tone.</h1>
      <h3 className="text-lg mb-4 max-w-xl">
        Welcome to GearTree, a digital exploration of artist rigs and the
        essentials you need to replicate classic tones from exceptional
        guitarists.
      </h3>
      <button className="w-40 flex items-center justify-center gap-2">
        Random Rig
        <img src={shuffleIcon} alt="Shuffle icon" className="w-5 h-5 invert brightness-0" />
      </button>
    </main>
  );
}
