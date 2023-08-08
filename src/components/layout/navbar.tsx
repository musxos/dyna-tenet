import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import Link from "next/link";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useAccount } from "wagmi";
import { ConnectButtonCustom } from "../custom-connect-button";

interface NavbarButtonProps {
  name: string;
  active?: boolean;
  path?: string;
  className?: string;
}

interface NavbarButtonListProps {
  buttons: NavbarButtonProps[];
  className?: string;
}

export function NavbarButton({ name, path }: NavbarButtonProps) {
  return (
    <Link
      href={path!}
      className="text-[15px] hover:bg-border h-full flex items-center justify-center px-8 py-4 font-medium cursor-pointer active:scale-95 transition"
    >
      {name}
    </Link>
  );
}

export function NavbarButtonList({ buttons }: NavbarButtonListProps) {
  const listItems = buttons.map((button, i) => (
    <NavbarButton
      name={button.name}
      active={button.active}
      path={button.path}
      key={i}
    />
  ));

  return <div className="hidden lg:flex ml-7">{listItems}</div>;
}

export function NavbarConnectButton() {
  const { openConnectModal } = useConnectModal();

  return (
    <button
      onClick={openConnectModal}
      className="bg-secondary hover:bg-neutral-700 h-12 px-6 rounded flex items-center justify-center cursor-pointer active:scale-95 transition"
    >
      Connect Wallet
    </button>
  );
}

export function Navbar() {
  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const sidebarClass = classNames(
    "fixed bottom-0 top-0 left-0 h-screen inset-0 bg-black/20 z-50 transition-all",
    {
      "translate-x-0": sidebarOpen,
      "-translate-x-full": !sidebarOpen,
    },
  );

  const buttons = [
    { name: "Trade", path: "/", active: true },
    { name: "Pool", path: "/pool" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Liquidity", path: "/liquidity" }
  ];

  useOnClickOutside(sidebarRef, () => setSidebarOpen(false));

  return (
    <>
      <nav className="pt-6 xl:px-0 px-4">
        <div className="container mx-auto flex justify-between items-center ">
          <div className="font-semibold w-96">
            <img className="w-44 lg:w-56" src="/logo.png" alt="" />
          </div>
          <div className="ml-auto flex lg:bg-secondary rounded-[15px] lg:border border-[#E6E6E6] h-full">
            <NavbarButtonList buttons={buttons} />

            <div className="ml-20 mr-2 items-center lg:flex hidden">
              <ConnectButtonCustom />
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="lg:hidden w-10 h-10 rounded bg-secondary flex  shrink-0 items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>
      <div className={sidebarClass}>
        <div
          ref={sidebarRef}
          className="bg-secondary rounded-r-[12px] w-3/4 h-full flex flex-col items-center py-4 px-4"
        >
          <div className="font-semibold w-full">
            <img className="w-44 lg:w-56 mx-auto" src="/logo.png" alt="" />
          </div>

          <div className="flex flex-col gap-11 w-full mt-auto">
            {buttons.map((button, i) => {
              return (
                <Link
                  href={button.path}
                  key={i}
                  className="text-2xl text-center py-2 w-full"
                >
                  {button.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto">
            <ConnectButtonCustom />
          </div>
        </div>
      </div>
    </>
  );
}
