import config from "@/app/config";
import { Navbar } from "@/components/layout/navbar";
import { PairState, setPair } from "@/features/pair/pair.slice";
import { useAddLiquidity } from "@/hooks/useAddLiquidity";
import { useAllowance } from "@/hooks/useAllowance";
import { useApprove } from "@/hooks/useApprove";
import { useBalanceOf } from "@/hooks/useBalanceOf";
import { useBalanaceOfV2 } from "@/hooks/useBalanceOf.v2";
import { useGetAmountOut } from "@/hooks/useGetAmountOut";
import { useGetReserves } from "@/hooks/useGetReserves";
import { usePair } from "@/hooks/usePair";
import { useRemoveLiquidity } from "@/hooks/useRemoveLiquidity";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { AnimatePresence, motion } from "framer-motion";
import { NumberInput } from "intl-number-input";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";

const NumberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 5,
  maximumFractionDigits: 5,
});

const PercentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PercentageFormatter_2 = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 5,
  maximumFractionDigits: 5,
});

export type BaseProps = {
  pair: PairState;
};

export function MyPosition(props: BaseProps) {
  const balanceOf = useBalanceOf(props.pair.pair?.pool.pairaddress as any);
  const totalSupply = useTotalSupply(props.pair.pair?.pool.pairaddress as any);
  const reserve = useGetReserves(props.pair.pair?.pool.pairaddress as any);

  const myPositionPercent = useMemo(() => {
    if (balanceOf.data == null || totalSupply.data == null) return 0;

    return (balanceOf.data / totalSupply.data) * 100;
  }, [balanceOf.data, totalSupply.data]);

  const myPositionToken0 = useMemo(() => {
    return reserve.data.reserve0 * myPositionPercent;
  }, [reserve.data]);

  const myPositionToken1 = useMemo(() => {
    return reserve.data.reserve1 * myPositionPercent;
  }, [reserve.data]);

  return (
    <>
      <h1 className="text-2xl font-medium flex items-center mb-6">
        My Position
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl p-8">
          <h1>
            <span className="text-[#777]">Total Liquidity</span>
          </h1>

          <span className="text-2xl font-medium mt-2">
            $
            {NumberFormatter.format(
              (props.pair.pair?.owner.price || 0) * myPositionToken0 +
                (props.pair.pair?.target.price || 0) * myPositionToken1,
            )}
          </span>
        </div>
        <div className="lg:col-span-1 bg-white rounded-xl p-8">
          <h1>
            <span className="text-[#777]">LP Tokens</span>
          </h1>

          <span className="text-2xl font-medium mt-2">
            {NumberFormatter.format(balanceOf.data || 0)}
          </span>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-xl">
          <h1>
            Your Position{" "}
            <span className="text-[#777]">
              ({PercentageFormatter_2.format(myPositionPercent)})
            </span>
          </h1>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center">
              <div className="px-2 py-1 rounded text-primary bg-primary/20 mr-4">
                {PercentageFormatter_2.format(
                  ((props.pair.pair?.owner.price || 0) * myPositionToken0) /
                    ((props.pair.pair?.owner.price || 0) * myPositionToken0 +
                      (props.pair.pair?.target.price || 0) * myPositionToken1),
                )}
              </div>
              <img
                className="w-8 h-8 rounded-full"
                src={props.pair.pair?.owner.image}
                alt=""
              />
              <span className="ml-2">{props.pair.pair?.owner.symbol}</span>

              <span className="ml-auto">
                {NumberFormatter.format(myPositionToken0)}
              </span>
            </div>
            <div className="flex items-center">
              <div className="px-2 py-1 rounded text-primary bg-primary/20 mr-4">
                {PercentageFormatter_2.format(
                  ((props.pair.pair?.target.price || 0) * myPositionToken1) /
                    ((props.pair.pair?.owner.price || 0) * myPositionToken0 +
                      (props.pair.pair?.target.price || 0) * myPositionToken1),
                )}
              </div>
              <img
                className="w-8 h-8 rounded-full"
                src={props.pair.pair?.target.image}
                alt=""
              />
              <span className="ml-2">{props.pair.pair?.target.symbol}</span>

              <span className="ml-auto">
                {NumberFormatter.format(myPositionToken1)}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-white p-8 rounded-xl hidden">
          <h1>
            Earnings <span className="text-[#777]">(0.00%)</span>
          </h1>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center">
              <div className="px-2 py-1 rounded text-primary bg-primary/20 mr-4">
                %50
              </div>
              <img className="w-8 h-8 rounded-full" src="eth2.png" alt="" />
              <span className="ml-2">ETH</span>

              <span className="ml-auto">0.00</span>
            </div>
            <div className="flex items-center">
              <div className="px-2 py-1 rounded text-primary bg-primary/20 mr-4">
                %50
              </div>
              <img className="w-8 h-8 rounded-full" src="eth2.png" alt="" />
              <span className="ml-2">ETH</span>

              <span className="ml-auto">0.00</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Withdraw(props: BaseProps) {
  const [amount, setAmount] = useState(0);
  const inputRef = useRef<any>(null);

  const removeLiquidity = useRemoveLiquidity();
  const balanceOf = useBalanceOf(props.pair.pair?.pool.pairaddress as any);
  const totalSupply = useTotalSupply(props.pair.pair?.pool.pairaddress as any);
  const reserve = useGetReserves(props.pair.pair?.pool.pairaddress as any);

  const account = useAccount();

  const ownerTokenAllowance = useAllowance(
    props.pair.pair?.pool.pairaddress as any,
  );
  const ownerTokenApprove = useApprove(
    props.pair.pair?.pool.pairaddress as any,
  );

  const handleOwnerTokenApprove = async () => {
    await ownerTokenApprove.contract.writeAsync({
      args: [config.ROUTER_ADDRESS, amount * 1e18],
    });
  };

  const handleRemoveLiquidity = async () => {
    await removeLiquidity.contract.writeAsync({
      args: [
        props.pair.pair?.owner.address as any,
        props.pair.pair?.target.address as any,
        amount * 1e18,
        0,
        0,
        account.address,
        Date.now() + 1000 * 60 * 1000,
      ],
    });
  };

  useEffect(() => {
    ownerTokenAllowance.contract.refetch();
  }, [
    removeLiquidity.waitForTransaction.isSuccess,
    ownerTokenApprove.waitForTransaction.isSuccess,
  ]);

  useEffect(() => {
    if (inputRef.current == null) return;

    const numberInput = new NumberInput({
      el: inputRef.current,
      options: {
        locale: "en-US",
      },

      onInput(value) {
        setAmount(value.number || 0);
      },
    });

    numberInput.setValue(0);
  }, [inputRef.current]);

  return (
    <>
      <h1 className="text-2xl font-medium">Withdraw</h1>
      <p className="text-[#777] text-sm mb-4">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae
        neque alias in illum distinctio nihil?
      </p>
      <h3 className="mb-4 text-[#777]">Amount to withdraw</h3>
      <div className="flex lg:flex-row flex-col gap-12 w-full">
        <div className="grow flex flex-col gap-12">
          <div className="flex flex-col p-8 rounded-xl bg-white">
            <input
              ref={inputRef}
              className="text-3xl outline-none mb-4 font-semibold"
              placeholder="0.0"
              type="text"
            />
            <div className="flex lg:flex-row flex-col lg:items-center justify-between">
              <span className="text-[#777]">
                $
                {NumberFormatter.format(
                  (((props.pair.pair?.pool.liquidity || 0) * amount) /
                    (balanceOf.data || 0)) *
                    ((balanceOf.data || 0) / (totalSupply.data || 0)),
                )}
              </span>
              <span className="text-[#777]">
                Avaiable {NumberFormatter.format(balanceOf.data || 0)}
              </span>
            </div>

            <div className="mt-8">
              <input
                onChange={(e) => {
                  if (inputRef.current == null) return;

                  inputRef.current.value = e.target.value;
                  setAmount(Number(e.target.value));
                }}
                min={0}
                max={balanceOf.data}
                className="w-full accent-purple-500"
                type="range"
              />

              <div className="grid grid-cols-4 gap-4 mt-4">
                <button
                  onClick={() => {
                    if (inputRef.current == null) return;

                    inputRef.current.value = String(
                      (balanceOf.data || 0) * 0.25,
                    );
                    setAmount((balanceOf.data || 0) * 0.25);
                  }}
                  className="lg:px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white"
                >
                  %25
                </button>
                <button
                  onClick={() => {
                    if (inputRef.current == null) return;

                    inputRef.current.value = String(
                      (balanceOf.data || 0) * 0.5,
                    );
                    setAmount((balanceOf.data || 0) * 0.5);
                  }}
                  className="lg:px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white"
                >
                  %50
                </button>
                <button
                  onClick={() => {
                    if (inputRef.current == null) return;

                    inputRef.current.value = String(
                      (balanceOf.data || 0) * 0.75,
                    );
                    setAmount((balanceOf.data || 0) * 0.75);
                  }}
                  className="lg:px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white"
                >
                  %75
                </button>
                <button
                  onClick={() => {
                    if (inputRef.current == null) return;

                    inputRef.current.value = String((balanceOf.data || 0) * 1);
                    setAmount((balanceOf.data || 0) * 1);
                  }}
                  className="lg:px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-8 rounded-xl bg-white">
            <div className="grid grid-cols-1 gap-6">
              <button className="py-2 px-6 rounded-xl text-primary border border-primary">
                Single
              </button>
              <div className="col-span-2 text-[#777] text-sm">
                You will receive all tokens in the balanced amounts.
              </div>

              <hr className="col-span-2" />

              <div className="col-span-2 flex flex-col gap-4">
                <div className="flex items-center">
                  <img
                    className="w-6 h-6 rounded-full"
                    src={props.pair.pair?.owner.image}
                    alt=""
                  />
                  <span className="ml-2">{props.pair.pair?.owner.symbol}</span>
                  <span className="ml-auto">
                    {NumberFormatter.format(
                      (((reserve.data.reserve0 * (balanceOf.data || 0)) /
                        (totalSupply.data || 0)) *
                        amount) /
                        (balanceOf.data || 0),
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-6 h-6 rounded-full"
                    src={props.pair.pair?.target.image}
                    alt=""
                  />
                  <span className="ml-2">{props.pair.pair?.target.symbol}</span>
                  <span className="ml-auto">
                    {NumberFormatter.format(
                      (((reserve.data.reserve1 * (balanceOf.data || 0)) /
                        (totalSupply.data || 0)) *
                        amount) /
                        (balanceOf.data || 0),
                    )}
                  </span>
                </div>
              </div>
            </div>
            {(ownerTokenAllowance.data?.allowance || 0) < (amount || 0) && (
              <button
                onClick={handleOwnerTokenApprove}
                className="mt-8 text-center border border-primary py-3 px-8 w-full rounded-xl text-primary hover:bg-primary hover:text-white transition"
              >
                {ownerTokenApprove.waitForTransaction.isError
                  ? "Approve Error"
                  : ownerTokenApprove.waitForTransaction.isLoading
                  ? "Approving..."
                  : "Approve LP"}
              </button>
            )}

            {(ownerTokenAllowance.data?.allowance || 0) >= (amount || 0) && (
              <button
                onClick={handleRemoveLiquidity}
                className="mt-8 text-center border border-primary py-3 px-8 w-full rounded-xl text-primary hover:bg-primary hover:text-white transition"
              >
                {removeLiquidity.waitForTransaction.isError
                  ? "Remove Liquidity Error"
                  : removeLiquidity.waitForTransaction.isLoading
                  ? "Removing Liquidity..."
                  : "Remove Liquidity"}
              </button>
            )}
          </div>
        </div>

        <div className="lg:w-96 flex flex-col gap-8">
          <div className="p-8 rounded-xl bg-white">
            <span className="text-xl font-medium text-primary">1/3</span>
            <h1 className="text-2xl text-black/80 mt-2">Choose a percent</h1>
            <p className="text-sm text-[#777] mt-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Voluptate unde laboriosam corrupti voluptatibus, autem ea!
            </p>
          </div>
          <div className="p-8 rounded-xl bg-white text-primary text-xl flex">
            My Pool Share{" "}
            <span className="ml-auto">
              {PercentageFormatter_2.format(
                (balanceOf.data || 0) / (totalSupply.data || 0),
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function Deposit(props: BaseProps) {
  const [amount, setAmount] = useState(0);

  const [token0, setToken0] = useState(0);
  const [token1, setToken1] = useState(0);

  const balanceOf = useBalanaceOfV2();

  const [numberInput, setNumberInput] = useState<any>(null);

  const inputRef = useRef<any>(null);

  const getAmountOut = useGetAmountOut({
    amount,
    path: [
      props.pair.pair?.owner.address as any,
      props.pair.pair?.target.address as any,
    ],
  });

  useEffect(() => {
    if (inputRef.current == null) return;

    const numberInput = new NumberInput({
      el: inputRef.current,
      options: {
        locale: "en-US",
      },

      onInput(value) {
        setAmount(value.number || 0);
      },
    });

    numberInput.setValue(0);

    setNumberInput(numberInput);
  }, [inputRef.current]);

  useEffect(() => {
    (async () => {
      const token_0_balance = await balanceOf.getBalance(
        props.pair.pair?.owner.address as any,
      );

      setToken0(token_0_balance.formatted);

      const token_1_balance = await balanceOf.getBalance(
        props.pair.pair?.target.address as any,
      );

      setToken1(token_1_balance.formatted);
    })();
  }, []);

  const ownerTokenAllowance = useAllowance(
    props.pair.pair?.owner.address as any,
  );
  const targetTokenAllowance = useAllowance(
    props.pair.pair?.target.address as any,
  );

  const ownerTokenApprove = useApprove(props.pair.pair?.owner.address as any);
  const targetTokenApprove = useApprove(props.pair.pair?.target.address as any);
  const addLiquidity = useAddLiquidity();

  const handleOwnerTokenApprove = async () => {
    await ownerTokenApprove.contract.writeAsync({
      args: [config.ROUTER_ADDRESS, amount * 1e18],
    });
  };

  const handleTargetTokenApprove = async () => {
    await targetTokenApprove.contract.writeAsync({
      args: [config.ROUTER_ADDRESS, (getAmountOut.data || 0) * 1e18],
    });
  };

  useEffect(() => {
    ownerTokenAllowance.contract.refetch();
    targetTokenAllowance.contract.refetch();
  }, [
    ownerTokenApprove.waitForTransaction.isSuccess,
    targetTokenApprove.waitForTransaction.isSuccess,
  ]);

  const account = useAccount();

  const handleAddLiquidity = async () => {
    await addLiquidity.contract.writeAsync({
      args: [
        props.pair.pair?.owner.address as any,
        props.pair.pair?.target.address as any,
        amount * 1e18,
        (getAmountOut.data || 0) * 1e18,
        0,
        0,
        account.address,
        Date.now() + 1000 * 60 * 10,
      ],
    });
  };

  useEffect(() => {
    if (!addLiquidity.waitForTransaction.isSuccess) return;

    setTimeout(() => {
      ownerTokenApprove.contract.reset();
      targetTokenApprove.contract.reset();
      addLiquidity.contract.reset();
    }, 1500);
  }, [addLiquidity.waitForTransaction.isSuccess]);

  return (
    <>
      <h1 className="text-2xl font-medium">Deposit</h1>
      <p className="text-[#777] mt-2">
        Deposit tokens to start earning trading fees and more rewards.
      </p>

      <div className="mt-12 flex lg:flex-row flex-col gap-12">
        <div className="bg-white p-8 grow rounded-xl h-max">
          <h3 className="text-[#777]">Tokens to deposit</h3>
          <div className="flex flex-col mt-8">
            <div className="flex lg:flex-row flex-col gap-2 lg:items-center">
              <div className="flex gap-4 items-center">
                <img
                  src={props.pair.pair?.owner.image}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />

                <div>
                  <span className="text-black/80 text-lg font-medium">
                    {props.pair.pair?.owner.symbol}
                  </span>
                </div>
              </div>
              <div className="text-[#777] ml-auto mr-4 truncate w-full">
                Balance {NumberFormatter.format(token0)}
              </div>

              <button
                onClick={() => {
                  if (numberInput == null) return;

                  numberInput.setValue(token0);
                }}
                className="px-4 py-1 rounded-full border border-primary text-primary"
              >
                Max
              </button>
            </div>

            <input
              ref={inputRef}
              className="bg-gray-100 rounded-xl mt-4 py-3 text-xl px-4"
              placeholder="0.00"
              type="text"
            />
          </div>
          <div className="flex flex-col mt-8">
            <div className="flex lg:flex-row flex-col lg:items-center">
              <div className="flex gap-4 items-center">
                <img
                  src={props.pair.pair?.target.image}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />

                <div>
                  <span className="text-black/80 text-lg font-medium">
                    {props.pair.pair?.target.symbol}
                  </span>
                </div>
              </div>
              <div className="text-[#777] ml-auto mr-4 truncate w-full">
                Balance {NumberFormatter.format(token1)}
              </div>
            </div>

            <input
              disabled
              className="bg-gray-100 rounded-xl mt-4 py-3 text-xl px-4"
              placeholder="0.00"
              value={NumberFormatter.format(getAmountOut.data || 0)}
            />
          </div>
          {(ownerTokenAllowance.data?.allowance || 0) < amount &&
            !ownerTokenApprove.waitForTransaction.isSuccess && (
              <button
                onClick={handleOwnerTokenApprove}
                className="mt-8 text-center border border-primary py-3 px-8 w-full rounded-xl text-primary hover:bg-primary hover:text-white transition"
              >
                {ownerTokenApprove.waitForTransaction.isError
                  ? "Approve Error"
                  : ownerTokenApprove.waitForTransaction.isLoading
                  ? "Approving..."
                  : "Approve"}
                ({props.pair.pair?.owner.symbol})
              </button>
            )}
          {(targetTokenAllowance.data?.allowance || 0) <
            (getAmountOut.data || 0) &&
            (ownerTokenAllowance.data?.allowance || 0) >= amount && (
              <button
                onClick={handleTargetTokenApprove}
                className="mt-8 text-center border border-primary py-3 px-8 w-full rounded-xl text-primary hover:bg-primary hover:text-white transition"
              >
                {targetTokenApprove.waitForTransaction.isError
                  ? "Approve Error"
                  : targetTokenApprove.waitForTransaction.isLoading
                  ? "Approving..."
                  : "Approve"}
                ({props.pair.pair?.target.symbol})
              </button>
            )}
          {amount <= (ownerTokenAllowance.data?.allowance || 0) &&
            (getAmountOut.data || 0) <=
              (targetTokenAllowance.data?.allowance || 0) && (
              <button
                onClick={handleAddLiquidity}
                className="mt-8 text-center border border-primary py-3 px-8 w-full rounded-xl text-primary hover:bg-primary hover:text-white transition"
              >
                {addLiquidity.waitForTransaction.isError
                  ? "Add Liquidity Error"
                  : addLiquidity.waitForTransaction.isLoading
                  ? "Adding Liquidity..."
                  : "Add Liquidity"}
              </button>
            )}
        </div>
        <div className="w-full lg:w-96 flex flex-col gap-8">
          <div className="bg-white p-8 rounded-xl">
            <p className="text-primary mb-4">1/4</p>
            <h1 className="text-2xl font-medium">Put your assets to work</h1>
            <p className="text-[#777] mt-2 text-sm">
              Deposit your tokens to start earning trading fees and more
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl">
            <h1 className="text-2xl font-medium text-[#777]">Price</h1>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex gap-4 items-center">
                <img
                  src={props.pair.pair?.owner.image}
                  className="w-6 h-6 rounded-full"
                  alt=""
                />
                <span className="text-black/80 text-lg font-medium">
                  {props.pair.pair?.owner.symbol}
                </span>
                <span className="ml-auto">
                  ${NumberFormatter.format(props.pair.pair?.owner.price || 0)}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <img
                  src={props.pair.pair?.target.image}
                  className="w-6 h-6 rounded-full"
                  alt=""
                />
                <span className="text-black/80 text-lg font-medium">
                  {props.pair.pair?.target.symbol}
                </span>
                <span className="ml-auto">
                  ${NumberFormatter.format(props.pair.pair?.target.price || 0)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex bg-white p-8 rounded-xl text-lg text-primary">
            My Pool Share{" "}
            <span className="ml-auto">
              {PercentageFormatter_2.format(
                ((props.pair.pair?.owner.price || 0) * amount * 2) /
                  ((props.pair.pair?.pool.liquidity || 0) +
                    (props.pair.pair?.owner.price || 0) * amount * 2),
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function Overview(props: BaseProps) {
  const reserve = useGetReserves(props.pair.pair?.pool.pairaddress as any);

  return (
    <>
      <h1 className="text-2xl font-semibold flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 stroke-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
          />
        </svg>
        <span className="ml-4">Classic Pool</span>
      </h1>
      <p className="text-[#777] text-sm mt-4">
        Contract:{" "}
        <span className="lg:ml-4">{props.pair.pair?.pool.pairaddress}</span>
      </p>
      <div className="mt-4 px-4 py-2 rounded bg-white lg:w-max flex items-center">
        <div className="flex items-center">
          <img
            src={props.pair.pair?.owner.image}
            alt="btc"
            className="w-6 h-6 rounded-full"
          />
          <span className="ml-2">
            {NumberFormatter.format(1 || 0)} {props.pair.pair?.owner.symbol}
          </span>
        </div>

        <span className="mx-4">=</span>

        <div className="flex items-center">
          <img
            src={props.pair.pair?.target.image}
            alt="eth"
            className="w-6 h-6 rounded-full"
          />
          <span className="ml-2">
            {NumberFormatter.format(
              (props.pair.pair?.owner.price || 0) *
                (1 / (props.pair.pair?.target.price || 0)) || 0,
            )}{" "}
            {props.pair.pair?.target.symbol}
          </span>
        </div>
      </div>

      <div className="flex flex-col mt-8 p-6 bg-white rounded-xl">
        <h3 className="text-[#777]">Assets in Pool</h3>

        <div className="flex flex-col gap-6 mt-4">
          <div className="flex items-center">
            <div className="px-2 font-semibold py-1 text-sm rounded bg-primary/20 text-primary">
              {PercentageFormatter.format(
                (reserve.data.reserve0 * (props.pair.pair?.owner.price || 0)) /
                  (reserve.data.reserve0 * (props.pair.pair?.owner.price || 0) +
                    reserve.data.reserve1 *
                      (props.pair.pair?.target.price || 0)),
              )}
            </div>
            <img
              src={props.pair.pair?.owner.image}
              alt="btc"
              className="w-6 h-6 ml-6 rounded-full"
            />
            <span className="ml-2">
              {NumberFormatter.format(reserve.data.reserve0)}{" "}
              {props.pair.pair?.owner.symbol}
            </span>
          </div>
          <div className="flex items-center">
            <div className="px-2 font-semibold py-1 text-sm rounded bg-primary/20 text-primary">
              {PercentageFormatter.format(
                (reserve.data.reserve1 * (props.pair.pair?.target.price || 0)) /
                  (reserve.data.reserve0 * (props.pair.pair?.owner.price || 0) +
                    reserve.data.reserve1 *
                      (props.pair.pair?.target.price || 0)),
              )}
            </div>
            <img
              src={props.pair.pair?.target.image}
              alt="btc"
              className="w-6 h-6 ml-6 rounded-full"
            />
            <span className="ml-2">
              {NumberFormatter.format(reserve.data.reserve1)}{" "}
              {props.pair.pair?.target.symbol}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4 p-6 bg-white rounded-xl">
        <div className="flex flex-col">
          <h3 className="text-[#777] text-sm">TVL</h3>
          <span className="text-2xl font-medium mt-2 opacity-75">
            {NumberFormatter.format(props.pair.pair?.pool.liquidity || 0)}
          </span>
        </div>
        <div className="flex flex-col">
          <h3 className="text-[#777] text-sm">Total APR</h3>
          <span className="text-2xl font-medium mt-2 opacity-75">
            {" "}
            {PercentageFormatter.format((props.pair.pair?.pool.apr || 0) / 100)}
          </span>
        </div>{" "}
        <div className="flex flex-col">
          <h3 className="text-[#777] text-sm">Volume (24h)</h3>
          <span className="text-2xl font-medium mt-2 opacity-50">-</span>
        </div>{" "}
        <div className="flex flex-col">
          <h3 className="text-[#777] text-sm">Fees (24h)</h3>
          <span className="text-2xl font-medium mt-2 opacity-50">-</span>
        </div>
      </div>
      <div className="flex flex-col mt-4 p-6 bg-white rounded-xl">
        <h1 className="text-[#777] text-xl">LP Rewards</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex items-center mt-6">
            <div className="w-12 h-12 rounded-xl border flex items-center justify-center bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 stroke-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                />
              </svg>
            </div>
            <div className="flex flex-col ml-4">
              <span className="text-[#777]">Fee APR (24h)</span>
              <span className="text-black/80 text-xl">-</span>
            </div>
          </div>
          <div className="flex items-center mt-6">
            <div className="w-12 h-12 rounded-xl border flex items-center justify-center bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 stroke-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                />
              </svg>
            </div>
            <div className="flex flex-col ml-4">
              <span className="text-[#777]">Rewards APR </span>
              <span className="text-black/80 text-xl">-</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Liquidity() {
  const [page, setPage] = useState("overview");
  const [pairAddress, setPairAddress] = useState("");
  const router = useRouter();
  const pair = usePair({
    autoFetch: true,
    pairAddress: pairAddress as any,
  });

  useEffect(() => {
    if (!router.isReady) return;

    const { pairAddress } = router.query;

    setPairAddress(pairAddress as string);
  }, [router.isReady]);

  return (
    <div className="flex lg:flex-row flex-col w-full">
      <div className="flex flex-row lg:flex-col gap-4 w-full overflow-x-auto  lg:w-44  [&_button]:w-32 [&_a]:w-32 [&_button]:grow-0 [&_a]:shrink-0 [&_button]:shrink-0 [&_a]:grow-0">
        <Link
          href="/pool"
          className="text-[#777]  text-left flex items-center py-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>

          <span className="ml-2">Pools</span>
        </Link>
        <button
          onClick={() => setPage("overview")}
          className="text-left hover:bg-white text-[#777] pl-6 pr-4 py-3 rounded-md"
        >
          Overview
        </button>
        <button
          onClick={() => setPage("my-position")}
          className="text-left hover:bg-white text-[#777] pl-6 pr-4 py-3 rounded-md"
        >
          My Position
        </button>
        <button
          onClick={() => setPage("deposit")}
          className="text-left hover:bg-white text-[#777] pl-6 pr-4 py-3 rounded-md"
        >
          Deposit
        </button>
        <button
          onClick={() => setPage("withdraw")}
          className="text-left hover:bg-white text-[#777] pl-6 pr-4 py-3 rounded-md"
        >
          Withdraw
        </button>
      </div>
      <div className="flex flex-col grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            {page === "overview" && <Overview pair={pair.state} />}
            {page === "my-position" && <MyPosition pair={pair.state} />}
            {page === "deposit" && <Deposit pair={pair.state} />}
            {page === "withdraw" && <Withdraw pair={pair.state} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
