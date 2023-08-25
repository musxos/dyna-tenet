import { Navbar } from "@/components/layout/navbar";
import Tokens from "@/context/tokens";
import { Token } from "@/features/token-swapper/token-swapper.slice";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toSvg } from "jdenticon";
import { useContext } from "react";
import { useAccount, useContractRead, useContractWrite } from "wagmi";

const NumberFormatter = new Intl.NumberFormat("en-US");

export function TableTokenItem({ token }: { token: Token }) {
  const account = useAccount();

  const { data } = useContractRead({
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: token.address as any,
    functionName: "balanceOf",
    args: [account.address],
    select: (data) => {
      return Number(data) / 10 ** 18;
    },
  });

  const addTokenToMetamask = async () => {
    try {
      console.log(token);
      await (window as any).ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: 18,
            image: (window as any).location.origin + token.image,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-6 bg-secondary p-6 rounded-custom border border-border font-medium">
      <div className="text-left py-2 col-span-6 lg:col-span-2">
        <div className="flex items-center">
          <div className="flex items-center w-32">
            <img
              className="w-11 h-11 rounded-full bg-secondary mr-4"
              src={token.image}
              alt=""
            />
            <div className="flex flex-col">
              <h5 className="text-lg">{token.symbol}</h5>
              <h6 className="text-sm text-[#777]">{token.name}</h6>
            </div>
          </div>
          <img
            onClick={addTokenToMetamask}
            className="w-6 h-6 ml-auto lg:ml-4"
            src="/import-token-mm.png"
            alt=""
          />
        </div>
      </div>

      <div className="flex lg:block items-center justify-between text-left py-2 col-span-6 lg:col-span-1">
        <h1 className="lg:hidden text-[#777] text-sm">Balance</h1>
        <div className="flex items-center lg:items-baseline lg:flex-col">
          <h5
            title={NumberFormatter.format(data || 0)}
            className="text-lg truncate w-full pr-6"
          >
            {NumberFormatter.format(data || 0) || "-"}
          </h5>
          <span className="text-lg lg:hidden mx-2">/</span>
          <h6 className="text-sm text-[#777]">$0.00</h6>
        </div>
      </div>

      <div className="flex lg:block items-center justify-between text-left py-2 col-span-6 lg:col-span-1">
        <h1 className="lg:hidden text-[#777] text-sm">Value</h1>
        <div className="flex items-center lg:items-baseline lg:flex-col">
          <h5 className="text-lg">0.0000</h5>
          <span className="text-lg lg:hidden mx-2">/</span>
          <h6 className="text-sm text-[#777]">$0.00</h6>
        </div>
      </div>

      <div className="flex lg:block lg:items-center justify-between text-left py-2 col-span-6 lg:col-span-1">
        <h1 className="lg:hidden text-[#777] text-sm">Price</h1>
        <div className="flex items-center lg:items-baseline lg:flex-col">
          <h5 className="text-lg">0.0000</h5>
          <span className="text-lg lg:hidden mx-2">/</span>
          <h6 className="text-sm text-[#777]">$0.00</h6>
        </div>
      </div>

      <div className="flex lg:block items-center justify-between text-left py-2 col-span-6 lg:col-span-1">
        <h1 className="lg:hidden text-[#777] text-sm">Change</h1>
        <div className="flex flex-row items-center lg:items-baseline lg:flex-col">
          <h5 className="text-lg">0.00%</h5>
          <span className="text-lg lg:hidden mx-2">/</span>
          <h6 className="text-sm text-[#777]">$0.00</h6>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { tokens } = useContext(Tokens);
  const account = useAccount();
  const claimContract = useContractWrite({
    abi: [
      {
        inputs: [],
        name: "claimTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    value: BigInt(0),
    functionName: "claimTokens",
    address: "0xD67c0e6C4b1Ce78201e5A8aE1C315542023A791F",
  });

  const claim = async () => {
    const result = await claimContract.writeAsync();
  };

  const { openConnectModal } = useConnectModal();

  if (!account.isConnected) {
    return (
      <>
        <Navbar />
        <main className="max-w-screen-sm mx-auto mt-12 lg:px-0 px-4 mb-8">
          <h1 className="text-xl font-medium text-primary">Portfolio</h1>
          <div className="rounded-custom bg-white border border-border px-8 py-6  h-96 mt-4 flex flex-col items-center justify-center">
            <h1 className="text-2xl text-primary font-semibold">Welcome</h1>
            <p className="text-[#777] my-4 text-sm">
              Connect your wallet to explore the DeFi ecosystem on the DynaSwap
            </p>

            <button
              onClick={openConnectModal}
              className="
              px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-light active:scale-95 transition rounded-[11px]
            "
            >
              Connect
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-12 lg:px-0 px-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-end lg:flex-nowrap flex-wrap bg-secondary p-6 rounded-custom border-border border w-full lg:w-max">
            <div
              dangerouslySetInnerHTML={{
                __html: toSvg(account.address, 96),
              }}
              className="lg:w-24 lg:h-24 w-20 h-20 rounded-[12px]"
            ></div>
            <div className="flex flex-col ml-4">
              <h5 className="text-sm text-[#777] font-medium">My Account</h5>
              {account.address && (
                <h1 className="text-lg font-medium">
                  {account.address.slice(0, 6)}...
                  {account.address.slice(account.address.length - 4)}
                </h1>
              )}
            </div>
            <button
              onClick={claim}
              className="ml-0 lg:ml-36 lg:mt-0 lg:w-max w-full lg:block mt-6 text-sm font-medium px-4 py-2 shadow text-white bg-primary hover:bg-primary-light active:scale-95 transition rounded-[11px]"
            >
              Claim Testnet Token
            </button>
          </div>
          <div className="flex flex-col mt-8">
            <div className="w-full overflow-x-auto">
              <div className="w-full lg:min-w-[716px]">
                <div className="grid-cols-6 lg:grid hidden px-6">
                  <th className="text-left text-[#777] pb-4 text-sm font-medium font-inter col-span-2">
                    Token
                  </th>
                  <th className="text-left text-[#777] pb-4 text-sm font-medium font-inter col-span-1">
                    Balance
                  </th>
                  <th className="text-left text-[#777] pb-4 text-sm font-medium font-inter col-span-1">
                    Value
                  </th>
                  <th className="text-left text-[#777] pb-4 text-sm font-medium font-inter col-span-1">
                    Price
                  </th>
                  <th className="text-left text-[#777] pb-4 text-sm font-medium font-inter col-span-1">
                    Change
                  </th>
                </div>
                <div className="flex flex-col gap-3">
                  {tokens.map((token, i) => (
                    <TableTokenItem key={i} token={token} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
