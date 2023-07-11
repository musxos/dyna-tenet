import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useAccount } from "wagmi";

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
  const { openConnectModal } = useConnectModal();

  return (
    <button
      onClick={openConnectModal}
      className="bg-neutral-800 hover:bg-neutral-700 h-12 px-6 rounded flex items-center justify-center cursor-pointer active:scale-95 transition"
    >
      Connect Wallet
    </button>
  );
}

export function Navbar() {
  const account = useAccount();
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
          <div className="font-semibold w-96">
            <img className="w-56" src="/logo.png" alt="" />
          </div>
          <NavbarButtonList buttons={buttons} />
          <div className="md:flex hidden justify-end items-center gap-4 w-96">
            <div>
              {account.isConnected && <ConnectButton />}
              {!account.isConnected && <NavbarConnectButton />}
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
                <button key={i} className="text-2xl py-2 text-left w-full">
                  {button.name}
                </button>
              );
            })}
          </div>

          <div className="mt-auto">
            <ConnectButton />
          </div>
        </div>
      </div>
    </>
  );
}
