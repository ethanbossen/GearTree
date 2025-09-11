import Distortion from "../assets/Distortion.svg";
import Flanger from "../assets/Flanger.svg";
import MetalZone from "../assets/MetalZone.svg";
import Overdrive from "../assets/Overdrive.svg";
import DigitalDelay from "../assets/DigitalDelay.svg";
import Phaser from "../assets/Phaser.svg";

function NotFound() {
  return (
    <div className="relative min-h-screen ">
      {/* Background pedals */}
      <img
        src={Distortion}
        alt="Distortion"
        className="absolute top-20 left-[10%] rotate-[-12deg] opacity-40 w-32"
      />
      <img
        src={Flanger}
        alt="Flanger"
        className="absolute top-40 left-[70%] rotate-[15deg] opacity-40 w-28"
      />
      <img
        src={MetalZone}
        alt="Metal Zone"
        className="absolute top-[60%] left-[20%] rotate-[25deg] opacity-45 w-36"
      />
      <img
        src={Overdrive}
        alt="Overdrive"
        className="absolute top-[75%] left-[60%] rotate-[-8deg] opacity-40 w-28"
      />
      <img
        src={DigitalDelay}
        alt="Digital Delay"
        className="absolute top-[30%] left-[40%] rotate-[5deg] opacity-45 w-32"
      />
      <img
        src={Phaser}
        alt="Phaser"
        className="absolute bottom-20 left-[80%] rotate-[-20deg] opacity-40 w-28"
      />

      {/* Main content */}
      <div className="relative z-10">
        <div className="pl-[8%] pr-10 pt-10 pb-20 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Bad News, Bucko.</h1>
          <p className="text-lg max-w-xl">
            The page you are looking for hasn't been created yet, but it could
            be. Maybe. In the future, but not right now. I'm a busy guy, okay?
          </p>
        </div>
        <div className="flex justify-center items-center">
          <h1 className="text-9xl font-bold">404</h1>
        </div>
        <div className="flex justify-center items-center pb-10">
          <p className="text-lg max-w-xl">
            Walk on{" "}
            <a href="/" className="underline">
              home
            </a>{" "}
            boy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
