// @ts-nocheck

import { store } from "@/app/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import "@rainbow-me/rainbowkit/styles.css";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import Tokens, { InitTokens } from "@/context/tokens";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnimatePresence, motion } from "framer-motion";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    {
      id: 155,
      name: "TENET",
      network: "TENET",
      iconUrl: "https://dynaswap.net/docs/wTENET.png",
      nativeCurrency: {
        decimals: 18,
        name: "TENET",
        symbol: "TENET",
      },
      rpcUrls: {
        public: {
          http: ["https://rpc.testnet.tenet.org"],
          webSocket: ["wss://rpc.testnet.tenet.org/ws"],
        },
        default: {
          http: ["https://rpc.testnet.tenet.org"],
          webSocket: ["wss://rpc.testnet.tenet.org/ws"],
        },
      },
      blockExplorers: {
        etherscan: { name: "tenetscan", url: "https://testnet.tenetscan.io/" },
        default: { name: "tenetscan", url: "https://testnet.tenetscan.io/" },
      },
    },
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return {
          http: "https://rpc.testnet.tenet.org",
          webSocket: "wss://rpc.testnet.tenet.org/ws",
        };
      },
    }),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "DynaSwap",
  projectId: "e0e56ad0a5922f3585d0a538850eb1c8",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps, router }: AppProps) {
  const [tokens, setTokens] = useState<InitTokens>(InitTokens || []);
  const pushToken = (token: any) => {
    setTokens((prev) => {
      return [...prev, token];
    });

    return token;
  };

  const removeToken = (token: any) => {
    setTokens((prev) => {
      const newTokens = { ...prev };
      delete newTokens[token.address];
      return newTokens;
    });
  };

  return (
    <Tokens.Provider
      value={{
        tokens: tokens,
        setTokens,
        pushToken,
        removeToken,
      }}
    >
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Provider store={store}>
            <Navbar />
            <AnimatePresence initial={false} mode="wait">
              <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={router.asPath}
                className="container mx-auto mt-12 xl:px-0 px-4 mb-8"
              >
                <Component {...pageProps} />
              </motion.main>
            </AnimatePresence>
          </Provider>
        </RainbowKitProvider>
      </WagmiConfig>
    </Tokens.Provider>
  );
}
