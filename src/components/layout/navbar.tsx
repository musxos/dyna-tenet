import classNames from "classnames";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface NavbarButtonProps {
  name: string;
  active?: boolean;
  className?: string;
}

interface NavbarButtonListProps {
  buttons: NavbarButtonProps[];
  className?: string;
}

export function NavbarButton({ name }: NavbarButtonProps) {
  return (
    <li className="text-lg first:rounded-l last:rounded-r bg-neutral-800 hover:bg-neutral-700 px-6 py-2 h-12 flex items-center text-white/90 cursor-pointer active:scale-95 transition">
      <a href={`/${name.toLowerCase()}`}>{name}</a>
    </li>
  );
}

export function NavbarButtonList({ buttons }: NavbarButtonListProps) {
  const listItems = buttons.map((button, i) => (
    <NavbarButton name={button.name} active={button.active} key={i} />
  ));

  return <ul className="hidden items-center md:flex">{listItems}</ul>;
}

export function NavbarConnectButton() {
  return (
    <button className="bg-neutral-800 hover:bg-neutral-700 h-12 px-6 rounded flex items-center justify-center cursor-pointer active:scale-95 transition">
      Connect Wallet
    </button>
  );
}

export function ChangeNetworkButton() {
  return (
    <div className="bg-neutral-800 hover:bg-neutral-700 hidden md:flex h-12 w-12 rounded items-center justify-center cursor-pointer active:scale-95 transition">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 32 32"
      >
        <g fill="none" fill-rule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <g fill="#FFF" fill-rule="nonzero">
            <path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
            <path d="M16.498 4L9 16.22l7.498-3.35z" />
            <path fill-opacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
            <path d="M16.498 27.995v-6.028L9 17.616z" />
            <path
              fill-opacity=".2"
              d="m16.498 20.573l7.497-4.353l-7.497-3.348z"
            />
            <path fill-opacity=".602" d="m9 16.22l7.498 4.353v-7.701z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const sidebarClass = classNames(
    "fixed bottom-0 top-0 left-0 h-screen inset-0 bg-black/50 z-50 transition-all",
    {
      "translate-x-0": sidebarOpen,
      "-translate-x-full": !sidebarOpen,
    },
  );

  const buttons = [
    { name: "Trade", active: true },
    { name: "Pool" },
    { name: "Portfolio" },
  ];

  useOnClickOutside(sidebarRef, () => setSidebarOpen(false));

  return (
    <>
      <nav className="py-8 md:px-0 px-4">
        <div className="container mx-auto flex justify-between items-center ">
          <div className="font-semibold w-72">
            <img className="w-56" src="/logo.png" alt="" />
          </div>
          <NavbarButtonList buttons={buttons} />
          <div className="md:flex hidden justify-end items-center gap-4 w-72">
            <ChangeNetworkButton />
            <div>
              <NavbarConnectButton />
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded bg-neutral-800 flex items-center justify-center"
          >
            ...
          </button>
        </div>
      </nav>
      <div className={sidebarClass}>
        <div
          ref={sidebarRef}
          className="bg-neutral-800 w-2/3 h-full flex flex-col items-center py-4 px-4"
        >
          <div className="font-semibold w-full">
            <img className="w-56" src="/logo.png" alt="" />
          </div>

          <div className="flex flex-col mt-12 w-full">
            {buttons.map((button, i) => {
              return (
                <button className="text-2xl py-2 text-left w-full">
                  {button.name}
                </button>
              );
            })}
          </div>

          <div className="mt-auto">
            <NavbarConnectButton />
          </div>
        </div>
      </div>
    </>
  );
}
