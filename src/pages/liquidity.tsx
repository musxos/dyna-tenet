import config from "@/app/config";
import { Navbar } from "@/components/layout/navbar";
import { Pool } from "@/features/pool/pool.slice";
import { useApprove } from "@/hooks/useApprove";
import { useBalanceOf } from "@/hooks/useBalanceOf";
import { useGetAmountOut } from "@/hooks/useGetAmountOut";
import { useGetReserves } from "@/hooks/useGetReserves";
import { usePools } from "@/hooks/usePools";
import { useRemoveLiquidity } from "@/hooks/useRemoveLiquidity";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toSvg } from "jdenticon";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const NumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
  maximumSignificantDigits: 6,
});

export function PoolCard({
  pool,
  selected = false,
  onClick,
}: {
  pool: Pool;
  selected: boolean;
  onClick?: () => void;
}) {
  const [liquid, setLiquid] = useState<number>(0);
  const reserves = useGetReserves(pool.pool.pairaddress);
  const totalSupply = useTotalSupply(pool.pool.pairaddress);
  const balanceOf = useBalanceOf(pool.pool.pairaddress);

  useEffect(() => {
    if (reserves.data == null) return;

    setLiquid(
      reserves.data.reserve0 * pool.owner.price +
        reserves.data.reserve1 * pool.target.price
    );
  }, [reserves.data]);

  return (
    <button
      onClick={onClick}
      className={
        "flex items-center hover:bg-gray-100 transition px-6 py-6 rounded-xl shadow [&.active]:bg-gray-100 ring ring-transparent [&.active]:ring-primary " +
        (selected ? "active" : "")
      }
    >
      <div className="flex items-center gap-1">
        <img className="w-8 h-8 rounded-full" src={pool.owner.image} alt="" />
        <img className="w-8 h-8 rounded-full" src={pool.target.image} alt="" />
      </div>
      <span className="text-sm ml-6">
        {pool.owner.symbol} / {pool.target.symbol}
      </span>
      <span className="text-sm ml-auto">
        {NumberFormatter.format(
          balanceOf.data && totalSupply.data
            ? (balanceOf.data / totalSupply.data) * reserves.data.reserve0
            : 0
        )}{" "}
        <span className="text-sm">{pool.owner.symbol}</span> /{" "}
        {NumberFormatter.format(
          balanceOf.data && totalSupply.data
            ? (balanceOf.data / totalSupply.data) * reserves.data.reserve1
            : 0
        )}{" "}
        <span className="text-sm">{pool.target.symbol}</span>
      </span>
    </button>
  );
}

export default function Liquidity() {
  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  const [selectedPair, setSelectedPair] = useState<Pool | null>(null);
  const [amount, setAmount] = useState<number>(0);

  const pools = usePools({
    autoFetch: true,
  });

  const balanceOf = useBalanceOf(selectedPair?.pool?.pairaddress as any);
  const totalSupply = useTotalSupply(selectedPair?.pool?.pairaddress as any);
  const reserves = useGetReserves(selectedPair?.pool?.pairaddress as any);
  const getAmountOut = useGetAmountOut({
    amount,
    path: [
      selectedPair?.owner?.address as any,
      selectedPair?.target?.address as any,
    ],
  });

  const ownerTokenApprove = useApprove(selectedPair?.owner?.address as any);
  const targetTokenApprove = useApprove(selectedPair?.target?.address as any);

  const handleOwnerApproveClick = async () => {
    await ownerTokenApprove.contract.writeAsync({
      args: [config.ROUTER_ADDRESS, amount * 1e18],
    });
  };

  const handleTargetApproveClick = async () => {
    await targetTokenApprove.contract.writeAsync({
      args: [config.ROUTER_ADDRESS, getAmountOut.data! * 1e18],
    });
  };

  const removeLiquidity = useRemoveLiquidity();

  const handleRemoveLiquidityClick = async () => {
    console.log(
      (balanceOf.data! / totalSupply.data!) * 1e18,
      totalSupply.data! ** 1e18
    );
    await removeLiquidity.contract.writeAsync({
      args: [
        selectedPair?.owner.address,
        selectedPair?.target.address,
        (balanceOf.data! / totalSupply.data!) * 1e18,
        amount * 1e18,
        getAmountOut.data! * 1e18 * 0.95,
        account.address,
        Date.now() + 1000 * 60 * 20,
      ],
    });
  };

  const handlePoolCardClick = (pool: Pool) => {
    setSelectedPair(pool);
  };

  if (!account.isConnected) {
    return (
      <>
        <Navbar />
        <main className="max-w-screen-sm mx-auto mt-12 lg:px-0 px-4 mb-8">
          <h1 className="text-xl font-medium text-primary">Liquidity</h1>
          <div className="rounded-custom bg-white border border-border px-8 py-6  h-96 mt-4 flex flex-col items-center justify-center">
            <h1 className="text-2xl text-primary font-semibold">Welcome</h1>
            <p className="text-[#777] my-4 text-sm">
              Connect your wallet to view your liquidity.
            </p>

            <button
              onClick={openConnectModal}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-light active:scale-95 transition rounded-[11px]"
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
      <main className="max-w-screen-xl mx-auto mt-12 lg:px-0 px-4 mb-8">
        <div className="flex flex-col">
          <h1 className="text-primary text-2xl font-semibold">Withdraw</h1>
          <p>Withdraw your liquidity from the pool.</p>

          <div className="flex lg:flex-row flex-col gap-8 mt-12">
            <div className="flex flex-col gap-6 grow">
              <p className="text-sm">Amount to Withdraw</p>
              <div className="rounded-xl bg-white shadow px-6 py-4">
                <p className="text-[#777] mt-4 text-sm">
                  You will be withdrawing{" "}
                  <span className="font-semibold">0</span> and{" "}
                  <span className="font-semibold">0</span> from the pool.
                </p>

                <hr className="my-4" />

                <div className="flex flex-col gap-4">
                  {pools.state.pools.map((pool, i) => (
                    <PoolCard
                      key={i}
                      pool={pool}
                      selected={
                        selectedPair?.pool.pairaddress == pool.pool.pairaddress
                      }
                      onClick={() => handlePoolCardClick(pool)}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-white shadow px-6 py-4">
                <h1 className="text-2xl font-semibold">{amount}</h1>
                <div className="flex justify-between mt-4">
                  <span>$0</span>
                  <span className="text-[#777]">
                    Available: {NumberFormatter.format(Number(balanceOf.data))}
                  </span>
                </div>
                <input
                  onChange={(e) => setAmount(Number(e.target.value))}
                  type="range"
                  value={amount}
                  className="w-full accent-primary mt-4"
                  min={0}
                  max={balanceOf.data}
                  step={0.01}
                />

                <div className="mt-4 grid grid-cols-4 gap-4 text-center text-primary font-semibold">
                  <button
                    onClick={() => setAmount(Number(balanceOf.data) * 0.25)}
                    className="rounded-xl hover:bg-primary hover:text-white border-primary px-8 py-1 border"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => setAmount(Number(balanceOf.data) * 0.5)}
                    className="rounded-xl hover:bg-primary hover:text-white border-primary px-8 py-1 border"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => setAmount(Number(balanceOf.data) * 0.75)}
                    className="rounded-xl hover:bg-primary hover:text-white border-primary px-8 py-1 border"
                  >
                    75%
                  </button>
                  <button
                    onClick={() => setAmount(Number(balanceOf.data))}
                    className="rounded-xl hover:bg-primary hover:text-white border-primary px-8 py-1 border"
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-96 flex flex-col gap-6">
              <div className="rounded-xl bg-white shadow px-6 py-4">
                <h2 className="font-semibold text-primary">3/3</h2>
                <h1 className="mt-4 text-xl font-semibold mb-2">
                  Funds will arive shortly
                </h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Deleniti, reprehenderit cumque. Eligendi est atque illum.
                </p>
              </div>
              <div className="flex justify-between rounded-xl bg-white shadow px-6 py-4">
                <h1 className="text-lg text-primary font-semibold">
                  My Pool Share
                </h1>
                <h1 className="text-lg text-primary font-semibold">%0</h1>
              </div>
              {!account.isConnected && (
                <button
                  onClick={openConnectModal}
                  className="text-white bg-primary rounded-md py-4 font-medium active:scale-95 transition"
                >
                  Connect Your Wallet
                </button>
              )}

              {account.isConnected && (
                <>
                  {!ownerTokenApprove.waitForTransaction.isSuccess &&
                    !targetTokenApprove.waitForTransaction.isSuccess && (
                      <button
                        onClick={handleOwnerApproveClick}
                        className="text-white bg-primary rounded-md py-4 font-medium active:scale-95 transition"
                      >
                        {ownerTokenApprove.waitForTransaction.isFetching
                          ? "Fetching..."
                          : ownerTokenApprove.waitForTransaction.isLoading
                          ? "Loading..."
                          : ownerTokenApprove.waitForTransaction.isError
                          ? "Error"
                          : "Approve " + selectedPair?.owner.symbol}
                      </button>
                    )}

                  {ownerTokenApprove.waitForTransaction.isSuccess &&
                    !targetTokenApprove.waitForTransaction.isSuccess && (
                      <button
                        onClick={handleTargetApproveClick}
                        className="text-white bg-primary rounded-md py-4 font-medium active:scale-95 transition"
                      >
                        {targetTokenApprove.waitForTransaction.isFetching
                          ? "Fetching..."
                          : targetTokenApprove.waitForTransaction.isLoading
                          ? "Loading..."
                          : targetTokenApprove.waitForTransaction.isError
                          ? "Error"
                          : "Approve " + selectedPair?.target.symbol}
                      </button>
                    )}

                  {ownerTokenApprove.waitForTransaction.isSuccess &&
                    targetTokenApprove.waitForTransaction.isSuccess && (
                      <button
                        onClick={handleRemoveLiquidityClick}
                        className="text-white bg-primary rounded-md py-4 font-medium active:scale-95 transition"
                      >
                        {removeLiquidity.waitForTransaction.isFetching
                          ? "Fetching..."
                          : removeLiquidity.waitForTransaction.isLoading
                          ? "Loading..."
                          : removeLiquidity.waitForTransaction.isError
                          ? "Error"
                          : removeLiquidity.waitForTransaction.isSuccess
                          ? "Success"
                          : "Remove Liquidity"}
                      </button>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
