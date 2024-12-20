import { useContext } from "react";
import { TonClient } from "@ton/ton";
import {
  CHAIN,
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { Address, Sender, SenderArguments } from "@ton/core";
import { TonConnectUI } from "@tonconnect/ui";
import { TonClientContext } from "@/contexts/TonClientContext";

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  connectionRestored: boolean;
  walletAddress: Address | null;
  network: CHAIN | null;
  tonConnectUI: TonConnectUI;
  tonClient: TonClient | undefined;
} {
  const [tonConnectUI] = useTonConnectUI();
  const { tonClient } = useContext(TonClientContext);
  const wallet = useTonWallet();
  const connectionRestored = useIsConnectionRestored();

  const walletAddress = wallet?.account?.address
    ? Address.parse(wallet.account.address)
    : undefined;

  return {
    sender: {
      send: async (args: SenderArguments) => {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc()?.toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000,
        });
      },
      address: walletAddress,
    },
    connected: !!wallet?.account?.address,
    connectionRestored,
    walletAddress: walletAddress ?? null,
    network: wallet?.account?.chain ?? null,
    tonConnectUI,
    tonClient,
  };
}
