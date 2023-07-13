import { useEffect, useMemo, useState } from "react";
import Modal from "./modal";
import { Pool } from "@/app/constant/pools";
import { useGetAmountOut } from "@/hooks/useGetAmountOut";
import { useApprove } from "@/hooks/useApprove";
import config from "@/app/config";
import { useAccount } from "wagmi";
import { useAddLiquidity } from "@/hooks/useAddLiquidity";

export function useLiquid({ pool }: { pool: Pool }) {
  const account = useAccount();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const getAmountOut = useGetAmountOut({
    amount,
    path: [pool.owner.address, pool.target.address],
  });

  const ownerTokenApprove = useApprove(pool.owner.address);
  const targetTokenApprove = useApprove(pool.target.address);

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

  const addLiquidity = useAddLiquidity();

  const handleAddLiquidityClick = async () => {
    await addLiquidity.contract.writeAsync({
      args: [
        pool.owner.address,
        pool.target.address,
        amount * 1e18,
        getAmountOut.data! * 1e18 * 0.95,
        0,
        0,
        account.address,
        Date.now() + 1000 * 60 * 20,
      ],
    });
  };

  useMemo(() => {
    if (modalOpen == false) {
      ownerTokenApprove.contract.reset();
      targetTokenApprove.contract.reset();
    }
  }, [modalOpen]);

  const modal = (
    <Modal
      className="w-[32rem] bg-white shadow rounded-2xl py-5 relative"
      open={modalOpen}
      setOpen={setModalOpen}
    >
      <h1 className="px-5 text-xl text-black font-medium text-center mb-6">
        Add Liquidity
      </h1>
      <div className="text-sm mx-5 rounded-lg mt-2 mb-6 px-4 py-2 text-violet-500 bg-violet-500/20">
        <b>İpucu: </b>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor aliquid
        dolorum culpa delectus minus id quaerat illum assumenda quibusdam odio
        non veniam exercitationem molestias, porro, deserunt, voluptate placeat
        est enim.
      </div>
      <button
        onClick={() => setModalOpen(false)}
        className="top-5 right-5 absolute text-black"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="flex flex-col gap-6 mt-3 px-5">
        <div className="relative bg-gray-100 rounded-lg border border-transparent focus-within:border-violet-500 transition">
          <input
            onChange={(e) => setAmount(Number(e.target.value))}
            className="px-4 pt-2 pb-12 text-2xl bg-transparent text-black w-full outline-none"
            type="text"
          />
          <div
            className="
            absolute top-2 right-2 flex flex-col gap-2
          "
          >
            <div className="flex items-center text-black px-3 py-1 rounded-lg shadow bg-gray-200">
              <img className="h-6 w-6" src={pool.owner.image} alt="" />
              <span className="ml-2">{pool.owner.symbol}</span>
            </div>
          </div>
        </div>
        <div className="text-xl text-black/50 text-center font-light">+</div>
        <div className="relative bg-gray-100 rounded-lg border border-transparent focus-within:border-violet-500 transition">
          <input
            value={getAmountOut.data || "0.00"}
            className="px-4 pt-2 pb-12 text-2xl bg-transparent text-black w-full outline-none"
            type="text"
            disabled
          />
          <div
            className="
            absolute top-2 right-2 flex flex-col gap-2
          "
          >
            <div className="flex items-center text-black px-3 py-1 rounded-md shadow bg-gray-200">
              <img
                className="h-6 w-6 rounded-full"
                src={pool.target.image}
                alt=""
              />
              <span className="ml-2">{pool.target.symbol}</span>
            </div>
          </div>
        </div>

        {!account.isConnected && (
          <button className="text-primary bg-primary/20 rounded-md py-4 font-semibold text-lg active:scale-95 transition">
            Connect Your Wallet
          </button>
        )}

        {account.isConnected && (
          <>
            {!ownerTokenApprove.waitForTransaction.isSuccess &&
              !targetTokenApprove.waitForTransaction.isSuccess && (
                <button
                  onClick={handleOwnerApproveClick}
                  className="text-primary bg-primary/20 rounded-md py-4 font-semibold text-lg active:scale-95 transition"
                >
                  {ownerTokenApprove.waitForTransaction.isFetching
                    ? "Fetching..."
                    : ownerTokenApprove.waitForTransaction.isLoading
                    ? "Loading..."
                    : ownerTokenApprove.waitForTransaction.isError
                    ? "Error"
                    : "Approve " + pool.owner.symbol}
                </button>
              )}

            {ownerTokenApprove.waitForTransaction.isSuccess &&
              !targetTokenApprove.waitForTransaction.isSuccess && (
                <button
                  onClick={handleTargetApproveClick}
                  className="text-primary bg-primary/20 rounded-md py-4 font-semibold text-lg active:scale-95 transition"
                >
                  {targetTokenApprove.waitForTransaction.isFetching
                    ? "Fetching..."
                    : targetTokenApprove.waitForTransaction.isLoading
                    ? "Loading..."
                    : targetTokenApprove.waitForTransaction.isError
                    ? "Error"
                    : "Approve " + pool.target.symbol}
                </button>
              )}

            {ownerTokenApprove.waitForTransaction.isSuccess &&
              targetTokenApprove.waitForTransaction.isSuccess && (
                <button
                  onClick={handleAddLiquidityClick}
                  className="text-primary bg-primary/20 rounded-md py-4 font-semibold text-lg active:scale-95 transition"
                >
                  {addLiquidity.waitForTransaction.isFetching
                    ? "Fetching..."
                    : addLiquidity.waitForTransaction.isLoading
                    ? "Loading..."
                    : addLiquidity.waitForTransaction.isError
                    ? "Error"
                    : addLiquidity.waitForTransaction.isSuccess
                    ? "Success"
                    : "Add Liquidity"}
                </button>
              )}
          </>
        )}
      </div>
    </Modal>
  );

  return {
    modal,
    setModalOpen,
    amount,
    setAmount,
  };
}
