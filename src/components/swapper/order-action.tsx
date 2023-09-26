import { useAccount } from "wagmi";
import { SwapperChainButtonType } from ".";
import { SwapperChainButton } from "./swap-chain-button";

export function OrderAction() {
  const account = useAccount();
  return (
    <>
      <div className="flex flex-col mb-4">
        <label
          htmlFor="in"
          className="flex flex-col relative w-full bg-gray-100 border border-border py-4 ring ring-transparent transition rounded-xl px-4 focus-within:ring-primary-light "
        >
          <span className="text-[#777] text-sm font-medium mb-2">
            You sell at most
          </span>
          <input
            id="in"
            required
            className=" text-xl font-semibold text-primary-dark outline-none bg-transparent"
            placeholder="0.0"
            type="text"
          />
          <SwapperChainButton type={SwapperChainButtonType.Sell} />
          {account.isConnected && (
            <p className="text-sm text-right ml-auto text-[#777] mt-4 truncate w-32">
              Balance: 0
            </p>
          )}
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label
          htmlFor="limitPrice"
          className="col-span-full rounded-xl bg-gray-100 border border-border px-4 py-2 ring ring-transparent focus-within:ring-primary"
        >
          <span className="text-[#777] text-sm font-medium">Limit price</span>
          <input
            id="limitPrice"
            className="bg-transparent outline-none text-lg mt-2 font-medium"
            type="text"
          />
        </label>
        <label
          htmlFor="expiry"
          className="col-span-full rounded-xl bg-gray-100 border border-border px-4 py-2 ring ring-transparent focus-within:ring-primary"
        >
          <span className="text-[#777] text-sm font-medium">Expiry</span>
          <div className="flex justify-between items-center mt-2">
            <span className="font-medium">7 Days</span>
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
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </label>
      </div>

      <hr className="my-8" />
      <div className="flex flex-col mb-4">
        <label
          htmlFor="out"
          className="flex flex-col relative w-full bg-gray-100 border border-border py-4 ring ring-transparent transition rounded-xl px-4 focus-within:ring-primary-light "
        >
          <span className="text-[#777] text-sm font-medium mb-2">
            You receive exactly
          </span>
          <input
            id="out"
            required
            className="font-semibold text-primary-dark outline-none bg-transparent text-xl"
            placeholder="0.0"
            type="text"
          />
          <SwapperChainButton type={SwapperChainButtonType.Buy} />
        </label>
      </div>

      <div className="flex flex-col">
        {!account.isConnected && (
          <button className="rounded-xl px-4 text-base py-4 mt-2 shadow bg-primary text-white font-medium hover:bg-primary-light active:scale-95 transition">
            Connect Wallet
          </button>
        )}
      </div>
    </>
  );
}
