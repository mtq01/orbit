import info from "../assets/icons/info.svg";
import globe from "../assets/icons/internet.svg";

const Footer = () => {
  return (
    <footer className="flex justify-between border-t py-5 px-4 shrink-0">
      <p className="flex gap-2 items-center">
        {/* <a
          href="#"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit Orbit Website"
          className="focus-visible:outline-orbit-blue"
        > */}
          <img
            src={info}
            // alt is left blank bcuz the link aria-label describes the action
            alt=""
            aria-hidden="true"
            className="w-5 h-5"
          />
        {/* </a> */}
        <span className="text-sm">Orbit v1.0</span>
      </p>
      {/* <a
        href="#"
        target="_blank"
        rel="noreferrer"
        aria-label="Orbit v1.0 - View Changelog"
        className="focus-visible:outline-orbit-blue"
      > */}
        <img
          src={globe}
          // alt is left blank bcuz the link aria-label describes the action
          alt=""
          aria-hidden="true"
          className="w-5 h-5"
        />
      {/* </a> */}
    </footer>
  );
};

export default Footer;
