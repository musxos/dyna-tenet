import config from "@/app/config";
import { Navbar } from "@/components/layout/navbar";
import { useLiquid } from "@/components/liquid-modal";
import { Pool } from "@/features/pool/pool.slice";
import { useApprove } from "@/hooks/useApprove";
import { useBalanceOf } from "@/hooks/useBalanceOf";
import { useGetReserves } from "@/hooks/useGetReserves";
import { usePools } from "@/hooks/usePools";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import classNames from "classnames";
import { motion } from "framer-motion";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

const NumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
  maximumSignificantDigits: 6,
});

export type ListItemProps = {
  pool: Pool;
  index?: number;
};

const variants = {
  initial: {
    opacity: 0,
  },
  enter: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
    },
  }),
};

export function ListItem({ pool, index }: ListItemProps) {
  const [open, setOpen] = useState(false);
  const [liquidity, setLiquid] = useState(0);

  const totalSupply = useTotalSupply(pool.pool.pairaddress);
  const balanceOf = useBalanceOf(pool.pool.pairaddress);
  const reserves = useGetReserves(pool.pool.pairaddress);

  const className = classNames(
    "col-span-6 overflow-hidden transition-all border-t flex flex-col",
    {
      "max-h-0 mt-0 border-transparent": !open,
      "max-h-[512px] mt-4 pt-4 border-[#D1D1D1]": open,
    },
  );

  useMemo(() => {
    setLiquid(
      reserves.data.reserve0 * pool.owner.price +
        reserves.data.reserve1 * pool.target.price,
    );
  }, [reserves.data]);

  return (
    <>
      <motion.div
        variants={variants}
        initial="initial"
        animate="enter"
        custom={index}
        onClick={() => setOpen((v) => !v)}
        className="grid grid-cols-6 bg-secondary border border-border py-4 rounded-custom active:scale-[.99] transition cursor-pointer h-full"
      >
        <div className="flex lg:flex-row flex-row-reverse items-center col-span-6 lg:col-span-2 pr-4 lg:pl-4">
          <div className="w-8 h-8 rounded-full border-2 border-transparent">
            <img className=" rounded-full" src={pool.owner.image} alt="" />
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-white -mr-2 lg:-ml-2 lg:mr-0">
            <img className=" rounded-full" src={pool.target.image} alt="" />
          </div>
          <h2 className="text-lg font-inter font-medium mr-auto ml-4">
            {pool.owner.symbol} / {pool.target.symbol}
          </h2>
        </div>
        <div className="flex items-center col-span-6 lg:ml-0 ml-4 lg:col-span-1">
          <span className="font-inter text-[#777] font-medium">Stable</span>
        </div>
        <div className="flex items-center col-span-6 lg:col-span-1 lg:pl-0 pl-4 lg:mt-0 mt-6">
          <span className="text-[#777] font-medium text-sm lg:hidden block">
            Liquidity:
          </span>
          <span className="lg:ml-0 ml-4 text-lg font-inter font-medium">
            ${NumberFormatter.format(liquidity)}
          </span>
        </div>
        <div className="flex items-center col-span-6 lg:col-span-1 lg:pl-0 pl-4 lg:mt-0 mt-1">
          <span className="text-[#777] font-medium text-sm lg:hidden block">
            APR:
          </span>
          <span className="text-lg font-inter font-medium lg:ml-0 ml-4">
            {pool.pool.apr}%
          </span>
        </div>
        <div className="flex items-center lg:justify-end col-span-6 lg:col-span-1 pr-4 lg:mt-0 mt-5">
          <Link
            href={`/liquidity?pairAddress=${pool.pool.pairaddress}`}
            className="font-inter font-medium text-center lg:w-max w-full lg:mx-0 mx-4 lg:bg-transparent bg-primary text-white lg:text-current py-3 lg:py-0 lg:rounded-none rounded-[11px]"
          >
            Manage Liquidity
          </Link>
        </div>
        <div className={className}>
          <div className="grid grid-cols-6 py-3 font-medium">
            <div className="flex lg:flex-row flex-col lg:items-center col-span-2 lg:col-span-1 pl-4 ">
              <h4 className="text-sm text-[#777]">Total APR:</h4>
              <span className="text-lg lg:ml-3">
                {pool.pool.apr + pool.pool.rewardApr}%
              </span>
            </div>
            <div className="flex lg:flex-row flex-col lg:items-center col-span-2 lg:col-span-1">
              <h4 className="text-sm text-[#777]">Fee APR:</h4>
              <span className="text-lg lg:ml-3">{pool.pool.feeApr}%</span>
            </div>
            <div className="flex lg:flex-row flex-col lg:items-center col-span-2 lg:col-span-1">
              <h4 className="text-sm font-medium text-[#777]">Rewards APR:</h4>
              <span className="text-lg lg:ml-3">{pool.pool.rewardApr}%</span>
            </div>
            <div className="hidden lg:block col-span-1"></div>
            <div className="flex lg:flex-row flex-col lg:items-center justify-end col-span-2 lg:col-span-2 lg:pr-4 pl-4 lg:mt-0 mt-6">
              <h4 className="text-sm text-[#777]">My Position:</h4>
              <span className="text-lg whitespace-nowrap lg:ml-3">
                {NumberFormatter.format(
                  balanceOf.data && totalSupply.data
                    ? (balanceOf.data / totalSupply.data) *
                        reserves.data.reserve0
                    : 0,
                )}{" "}
                <span className="text-sm">{pool.owner.symbol}</span> /{" "}
                {NumberFormatter.format(
                  balanceOf.data && totalSupply.data
                    ? (balanceOf.data / totalSupply.data) *
                        reserves.data.reserve1
                    : 0,
                )}{" "}
                <span className="text-sm">{pool.target.symbol}</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function TrendItem({ pool, index }: ListItemProps) {
  const reserves = useGetReserves(pool.pool.pairaddress);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      custom={index}
      className="flex flex-col bg-secondary border border-border rounded-custom w-full py-8 px-6"
    >
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-inter font-medium">
            {pool.owner.symbol} / {pool.target.symbol}
          </h2>
          <div className="text-primary flex items-center mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="fill-primary mr-2"
            >
              <path
                fill="currentColor"
                d="M1 21h22L12 2L1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
              />
            </svg>
            <span className="font-inter font-medium text-sm">Stable</span>
          </div>
        </div>
        <div className="flex">
          <div className="w-8 h-8 border border-transparent rounded-full">
            <img className=" rounded-full" src={pool.owner.image} alt="" />
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-white -ml-2">
            <img
              className="w-full h-full rounded-full"
              src={pool.target.image}
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="flex items-center mt-4">
        <span className="font-inter text-[#777] text-sm font-medium">
          Liquidity:
        </span>
        <span className="text-lg font-inter ml-2 font-medium">
          $
          {NumberFormatter.format(
            reserves.data.reserve0 * pool.owner.price +
              reserves.data.reserve1 * pool.target.price,
          )}
        </span>
        <span className="ml-auto">
          <span className="font-inter text-[#777] text-sm font-medium">
            APR:
          </span>
          <span className="text-lg font-inter ml-2 font-medium">
            {pool.pool.apr}%
          </span>
        </span>
      </div>
    </motion.div>
  );
}

export default function Pool() {
  const pools = usePools({
    autoFetch: true,
  });

  const [trendPools, setTrendPools] = useState<Pool[]>([]);

  useMemo(() => {
    if (!pools.state.pools) return;

    const arr = [...pools.state.pools];

    setTrendPools([
      ...arr
        .sort((a, b) => {
          return b.pool.apr - a.pool.apr;
        })
        .slice(0, 3),
    ]);
  }, [pools.state.pools]);

  return (
    <>
      <section className="flex flex-col">
        <div className="flex items-center space-x-2 mb-12">
          <h2 className="font-inter text-primary font-medium text-xl">
            Trending
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-6">
          {trendPools.map((pool, i) => (
            <Suspense key={i} fallback={<div>Loading...</div>}>
              <TrendItem pool={pool} index={i} />
            </Suspense>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <div className="flex items-center">
          <h1 className="font-inter text-xl text-primary font-medium">
            All Pools
          </h1>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="w-full lg:min-w-fit">
            <div className="grid grid-cols-6">
              <p className="text-left font-inter font-normal text-[#777] text-sm pb-4 col-span-2">
                Pool
              </p>
              <p className="text-left font-inter font-normal text-[#777] text-sm pb-4 col-span-1">
                Type
              </p>
              <p className="text-left font-inter font-normal text-[#777] text-sm pb-4 col-span-1">
                Liquidity
              </p>
              <p className="text-left font-inter font-normal text-[#777] text-sm pb-4 col-span-1">
                APR
              </p>
              <p className="text-left font-inter font-normal text-[#777] text-sm pb-4 col-span-1"></p>
            </div>
            <div>
              <div className="flex flex-col gap-2 rounded">
                {pools.state.pools.map((pool, i) => (
                  <ListItem key={i} pool={pool} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
