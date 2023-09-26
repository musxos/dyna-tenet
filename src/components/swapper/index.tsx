import useTokenSwapper from "@/hooks/useTokenSwapper";
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";
import { SwapAction } from "./swap-action";
import { OrderAction } from "./order-action";

export enum SwapperChainButtonType {
  Sell,
  Buy,
}

export function Swapper({ routes }: any) {
  const { tokenSwapper, setActionType } = useTokenSwapper();

  const activeClass = classNames("text-primary border-b-2 border-primary");
  const defaultClass = classNames("border-b border-[#D1D1D1] opacity-50");

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-8 w-full xl:w-96 flex flex-col rounded-custom border border-border bg-secondary h-full"
    >
      <ul className="flex text-xl w-full">
        <li
          onClick={() => setActionType("swap")}
          className={
            "grow pb-3 cursor-pointer pr-4 font-medium " +
            (tokenSwapper.actionType == "swap" ? activeClass : defaultClass)
          }
        >
          Swap
        </li>
        <li
          onClick={() => setActionType("order")}
          title="Coming Soon"
          className={
            "grow pr-4 font-medium cursor-pointer " +
            (tokenSwapper.actionType == "order" ? activeClass : defaultClass)
          }
        >
          Order
        </li>
      </ul>
      <div className="flex flex-col mt-6 h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={tokenSwapper.actionType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {tokenSwapper.actionType == "swap" && (
              <SwapAction routes={routes} />
            )}
            {tokenSwapper.actionType == "order" && <OrderAction />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
