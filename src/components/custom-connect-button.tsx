import { ConnectButton } from "@rainbow-me/rainbowkit";

const NumberFormat = new Intl.NumberFormat("en-US");
export const ConnectButtonCustom = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="rounded-[11px] bg-primary px-5 py-3 my-2 text-white font-medium text-sm"
                    onClick={openConnectModal}
                    type="button"
                  >
                    CONNECT WALLET
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div
                  className="border border-border rounded-[12px] my-2"
                  style={{ display: "flex", gap: 12 }}
                >
                  <button
                    className="px-4 py-2"
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    <div className="flex items-end text-lg font-medium">
                      {NumberFormat.format(
                        (account.balanceFormatted as any) || 0,
                      )}
                      <span className="text-sm font-medium ml-1">
                        {chain.name}
                      </span>
                    </div>
                  </button>
                  <button
                    className="flex rounded-[9px] bg-[#F3F4F6] px-4 py-2 m-1"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 8,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                          />
                        )}
                      </div>
                    )}
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
