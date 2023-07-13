import { Tokens } from "@/app/constant/tokens";
import { Navbar } from "@/components/layout/navbar";
import { Token } from "@/features/token-swapper/token-swapper.slice";
import { useAccount, useContractRead, useContractWrite } from "wagmi";

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
      await (window as any).ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: 18,
            image: "https://dyna-tenet.vercel.app/" + token.image,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <tr>
      <td className="text-left py-2">
        <div className="flex items-center">
          <div className="flex items-center w-32">
            <img
              className="w-8 h-8 rounded-full bg-neutral-800 mr-4"
              src={token.image}
              alt=""
            />
            <div className="flex flex-col">
              <h5 className="text-sm">{token.symbol}</h5>
              <h6 className="text-xs text-white/60">{token.name}</h6>
            </div>
          </div>
          <img
            onClick={addTokenToMetamask}
            className="w-6 h-6 ml-4"
            src="/import-token-mm.png"
            alt=""
          />
        </div>
      </td>

      <td className="text-left py-2">
        <div className="flex flex-col">
          <h5 className="text-sm">{data}</h5>
          <h6 className="text-xs text-white/60">$0.00</h6>
        </div>
      </td>

      <td className="text-left py-2">
        <div className="flex flex-col">
          <h5 className="text-sm">0.0000</h5>
          <h6 className="text-x s text-white/60">$0.00</h6>
        </div>
      </td>

      <td className="text-left py-2">
        <div className="flex flex-col">
          <h5 className="text-sm">0.0000</h5>
          <h6 className="text-xs text-white/60">$0.00</h6>
        </div>
      </td>

      <td className="text-left py-2">
        <div className="flex flex-col">
          <h5 className="text-sm">0.00%</h5>
          <h6 className="text-xs text-white/60">$0.00</h6>
        </div>
      </td>
    </tr>
  );
}

export default function Portfolio() {
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

  return (
    <>
      <Navbar />
      <main className="container max-w-screen-lg mx-auto mt-12 md:px-0 px-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-md bg-neutral-800"></div>
            <div className="flex flex-col ml-8">
              <h5 className="text-sm text-white/50">My Account</h5>
              {account.address && (
                <h1 className="text-lg">
                  {account.address.slice(0, 6)}...
                  {account.address.slice(account.address.length - 4)}
                </h1>
              )}
            </div>
            <button
              onClick={claim}
              className="rounded text-sm px-4 py-2 shadow text-white bg-neutral-800 font-semibold w-max hover:bg-primary-light active:scale-95 transition ml-auto"
            >
              Claim Testnet Token
            </button>
          </div>
          <div className="flex items-center justify-between mt-8 text-white/60">
            <h4>+ Also view on</h4>
          </div>
          <div className="flex flex-col mt-8">
            <div className="w-full">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-white/60 pb-4 text-sm font-medium font-inter">
                      Token
                    </th>
                    <th className="text-left text-white/60 pb-4 text-sm font-medium font-inter">
                      Balance
                    </th>
                    <th className="text-left text-white/60 pb-4 text-sm font-medium font-inter">
                      Value
                    </th>
                    <th className="text-left text-white/60 pb-4 text-sm font-medium font-inter">
                      Price
                    </th>
                    <th className="text-left text-white/60 pb-4 text-sm font-medium font-inter">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Tokens.map((token, i) => (
                    <TableTokenItem key={i} token={token} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
