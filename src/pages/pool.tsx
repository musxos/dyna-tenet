import { Navbar } from "@/components/layout/navbar";
import classNames from "classnames";
import { useState } from "react";

export function ListItem() {
  const [open, setOpen] = useState(false);

  const className = classNames(
    "col-span-6 h-full overflow-hidden transition-all border-gradient flex flex-col",
    {
      "max-h-0 mt-0 border-t-0": !open,
      "max-h-[512px] mt-4 pt-4": open,
    },
  );

  return (
    <div
      onClick={() => setOpen((v) => !v)}
      className="grid grid-cols-6 bg-neutral-800 py-4 rounded-md active:scale-[.99] transition cursor-pointer"
    >
      <div className="flex items-center col-span-2 pl-4 ">
        <div className="w-10 h-10 bg-neutral-700 rounded-full border border-neutral-700">
          <img className=" rounded-full" src="/usdt.webp" alt="" />
        </div>
        <div className="w-10 h-10 bg-neutral-700 rounded-full border border-neutral-700">
          <img className=" rounded-full" src="/eth2.png" alt="" />
        </div>
        <h2 className="text-lg font-inter font-medium ml-4">USDT / ETH</h2>
      </div>
      <div className="flex items-center col-span-1 ">
        <span className="font-inter text-white/50 text-sm">Stable</span>
      </div>
      <div className="flex items-center col-span-1 ">
        <span className="text-lg font-inter font-medium">$6,663,268.7</span>
      </div>
      <div className="flex items-center col-span-1 ">
        <span className="text-lg font-inter font-medium">3.9%</span>
      </div>
      <div className="flex items-center justify-end col-span-1 pr-4">
        <button className="font-inter text-sm font-medium text-white/50">
          Add Liquidity
        </button>
      </div>
      <div className={className}>
        <div className="grid grid-cols-6 mb-6">
          <div className="flex flex-col col-span-1 pl-6 ">
            <h4 className="text-sm">Total APR</h4>
            <span className="text-lg">13.8%</span>
          </div>
          <div className="flex flex-col col-span-1">
            <h4 className="text-sm">Fee APR</h4>
            <span className="text-lg">13.8%</span>
          </div>
          <div className="flex flex-col col-span-1">
            <h4 className="text-sm">Rewards APR</h4>
            <span className="text-lg">13.8%</span>
          </div>
        </div>
        <div className="grid grid-cols-6">
          <div className="flex flex-col col-span-1 pl-6">
            <h4 className="text-sm">My Position</h4>
            <span className="text-lg">-</span>
          </div>
          <div className="flex flex-col col-span-1">
            <h4 className="text-sm">My Stalked</h4>
            <span className="text-lg">-</span>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
}

export default function Pool() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-12 md:px-0 px-4 mb-8">
        <section className="flex flex-col">
          <div className="flex items-center space-x-2 mb-12">
            <svg
              className="fill-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g>
                <path d="M10.277 16.515c.005-.11.186-.154.24-.058c.254.45.686 1.111 1.176 1.412c.49.3 1.276.386 1.792.408c.11.005.153.186.057.24c-.45.254-1.11.686-1.411 1.176c-.301.49-.386 1.276-.408 1.792c-.005.11-.187.153-.24.057c-.254-.45-.686-1.11-1.177-1.411c-.49-.301-1.276-.386-1.791-.408c-.11-.005-.154-.187-.058-.24c.45-.254 1.111-.686 1.412-1.177c.3-.49.386-1.276.408-1.791Z" />
                <path
                  d="M18.492 15.515c-.009-.11-.2-.156-.258-.062c-.172.283-.42.623-.697.793c-.276.17-.692.236-1.022.262c-.11.008-.156.2-.062.257c.282.172.623.42.793.697c.17.276.236.693.262 1.023c.008.11.2.155.257.061c.172-.282.42-.623.697-.792c.276-.17.693-.237 1.023-.262c.11-.009.155-.2.061-.258c-.282-.172-.623-.42-.792-.697c-.17-.276-.237-.692-.262-1.022Z"
                  opacity=".5"
                />
                <path d="m14.703 4.002l-.242-.306c-.937-1.183-1.405-1.775-1.95-1.688c-.544.088-.805.796-1.326 2.213l-.135.366c-.148.403-.222.604-.364.752c-.142.148-.336.225-.724.38l-.353.141l-.247.1c-1.2.48-1.804.753-1.882 1.283c-.082.565.49 1.049 1.634 2.016l.296.25c.326.275.488.413.581.6c.094.187.107.403.133.835l.024.393c.094 1.52.14 2.28.635 2.542c.494.262 1.108-.147 2.336-.966l.318-.212c.349-.233.523-.35.723-.381c.2-.032.401.024.806.136l.367.102c1.423.394 2.134.591 2.521.188c.388-.403.195-1.14-.19-2.613l-.1-.381c-.109-.419-.164-.628-.134-.835c.03-.207.142-.389.366-.752l.203-.33c.785-1.276 1.178-1.914.924-2.426c-.255-.51-.988-.557-2.454-.648l-.38-.024c-.416-.026-.624-.039-.805-.135c-.181-.096-.314-.264-.58-.6Z" />
                <path
                  d="M8.835 13.326C6.698 14.37 4.919 16.024 4.248 18c-.752-4.707.292-7.747 1.965-9.637c.144.295.332.539.5.73c.35.396.852.82 1.362 1.251l.367.31l.17.145c.005.064.01.14.015.237l.03.485c.04.655.08 1.294.178 1.805Z"
                  opacity=".5"
                />
              </g>
            </svg>{" "}
            <h2 className="font-inter text-white/90 font-medium">Trending</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="relative rounded-xl bg-neutral-800 h-32 w-full py-8 px-6">
              <div className="absolute bottom-0 translate-y-full left-5 w-44 h-1 rounded-b bg-gradient-to-l from-primary to-blue-500" />
              <div className="absolute top-0 -translate-y-1/2 left-10">
                <div className="flex">
                  <div className="w-10 h-10 bg-neutral-700 rounded-full border border-neutral-700">
                    <img className=" rounded-full" src="/usdt.webp" alt="" />
                  </div>
                  <div className="w-10 h-10 bg-neutral-700 rounded-full border border-neutral-700">
                    <img className=" rounded-full" src="/eth2.png" alt="" />
                  </div>
                </div>
              </div>

              <div className="flex">
                <h2 className="text-lg font-inter font-medium">USDT / ETH</h2>
                <div className="text-white/30 flex items-center ml-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M1 21h22L12 2L1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                    />
                  </svg>
                  <span className="ml-1 font-inter text-sm">Stable</span>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <span className="font-inter text-white/50 text-sm">
                  Liquidity:
                </span>
                <span className="text-lg font-inter ml-2 font-medium">
                  $6,663,268.7
                </span>
                <span className="ml-auto">
                  <span className="font-inter text-white/50 text-sm">APR:</span>
                  <span className="text-lg font-inter ml-2 font-medium">
                    3.9%
                  </span>
                </span>
              </div>
            </div>
            <div className="relative rounded-xl bg-neutral-800 h-32 w-full py-8 px-6">
              <div className="absolute bottom-0 translate-y-full left-5 w-44 h-1 rounded-b bg-gradient-to-l from-pink-500 to-blue-500" />
              <div className="absolute top-0 -translate-y-1/2 left-10">
                <div className="flex">
                  <div className="w-10 h-10 bg-neutral-700 rounded-full border border-neutral-700">
                    <img className=" rounded-full" src="/usdt.webp" alt="" />
                  </div>
                  <div className="w-10 h-10 bg-neutral-700 rounded-full border border-neutral-700">
                    <img className=" rounded-full" src="/eth2.png" alt="" />
                  </div>
                </div>
              </div>

              <div className="flex">
                <h2 className="text-lg font-inter font-medium">USDT / ETH</h2>
                <div className="text-white/30 flex items-center ml-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M1 21h22L12 2L1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                    />
                  </svg>
                  <span className="ml-1 font-inter text-sm">Stable</span>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <span className="font-inter text-white/50 text-sm">
                  Liquidity:
                </span>
                <span className="text-lg font-inter ml-2 font-medium">
                  $6,663,268.7
                </span>
                <span className="ml-auto">
                  <span className="font-inter text-white/50 text-sm">APR:</span>
                  <span className="text-lg font-inter ml-2 font-medium">
                    3.9%
                  </span>
                </span>
              </div>
            </div>
            <div className="relative rounded-xl bg-neutral-800 h-32 w-full py-8 px-6">
              <div className="absolute bottom-0 translate-y-full left-5 w-44 h-1 rounded-b bg-gradient-to-l from-green-500 to-blue-500" />
              <div className="absolute top-0 -translate-y-1/2 left-10">
                <div className="flex">
                  <div className="w-10 h-10 bg-neutral-700 rounded-full border border-neutral-700">
                    <img className=" rounded-full" src="/usdt.webp" alt="" />
                  </div>
                  <div className="w-10 h-10 bg-neutral-700 rounded-full border border-neutral-700">
                    <img className=" rounded-full" src="/eth2.png" alt="" />
                  </div>
                </div>
              </div>

              <div className="flex">
                <h2 className="text-lg font-inter font-medium">USDT / ETH</h2>
                <div className="text-white/30 flex items-center ml-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M1 21h22L12 2L1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                    />
                  </svg>
                  <span className="ml-1 font-inter text-sm">Stable</span>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <span className="font-inter text-white/50 text-sm">
                  Liquidity:
                </span>
                <span className="text-lg font-inter ml-2 font-medium">
                  $6,663,268.7
                </span>
                <span className="ml-auto">
                  <span className="font-inter text-white/50 text-sm">APR:</span>
                  <span className="text-lg font-inter ml-2 font-medium">
                    3.9%
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <div className="flex items-center">
            <svg
              className="stroke-primary mr-6"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke-linecap="round" stroke-width="1.5">
                <path d="M14 12a6 6 0 1 1-6-6" />
                <path d="M10 12a6 6 0 1 1 6 6" opacity=".5" />
              </g>
            </svg>
            <h1 className="font-inter text-3xl bg-gradient-to-l text-transparent from-white font-medium to-pink-500 bg-clip-text">
              All Pools
            </h1>
            <svg
              className="ml-10"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314Z"
              />
            </svg>{" "}
          </div>

          <div className="mt-4">
            <div className="w-full">
              <div className="grid grid-cols-6">
                <p className="text-left font-inter font-normal text-white/50 text-sm pb-4 col-span-2">
                  Pool
                </p>
                <p className="text-left font-inter font-normal text-white/50 text-sm pb-4 col-span-1">
                  Type
                </p>
                <p className="text-left font-inter font-normal text-white/50 text-sm pb-4 col-span-1">
                  Liquidity
                </p>
                <p className="text-left font-inter font-normal text-white/50 text-sm pb-4 col-span-1">
                  APR
                </p>
                <p className="text-left font-inter font-normal text-white/50 text-sm pb-4 col-span-1"></p>
              </div>
              <div>
                <div className="flex flex-col gap-2 rounded">
                  <ListItem />
                  <ListItem />
                  <ListItem />
                  <ListItem />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
