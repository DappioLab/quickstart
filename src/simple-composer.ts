import * as anchor from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import {
  AddLiquidityParams,
  StakeParams,
  GatewayBuilder,
  SupportedProtocols,
  SwapParams,
} from "@dappio-wonderland/gateway";

export const composeAndSend = async () => {
  const zapInAmount = 10000;

  // 1. Setup
  // 1-1. Create a RPC connection
  const connection = new anchor.web3.Connection("https://rpc-mainnet-fork.epochs.studio", {
    commitment: "confirmed",
    wsEndpoint: "wss://rpc-mainnet-fork.epochs.studio/ws",
    confirmTransactionInitialTimeout: 300 * 1000,
  });

  // 1-2. Setup Anchor provider
  const options = anchor.AnchorProvider.defaultOptions();
  const wallet = NodeWallet.local();
  const provider = new anchor.AnchorProvider(connection, wallet, options);
  anchor.setProvider(provider);

  // 1-3. Request for airdrop 0.1 SOL
  connection.requestAirdrop(wallet.publicKey, 100000000); // 0.1 SOL

  // 1-4. Setup Gateway
  const gateway = new GatewayBuilder(provider);

  // 2. Compose: Swap (SOL => tokenA) + Swap (SOL => tokenB) + AddLiquidity + Stake in Raydium
  // 2-1. Config swap parameters
  const tokenASwapParams: SwapParams = {
    protocol: SupportedProtocols.Jupiter,
    fromTokenMint: new anchor.web3.PublicKey(
      "So11111111111111111111111111111111111111112" // WSOL
    ),
    toTokenMint: new anchor.web3.PublicKey(
      "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" // RAY
    ),
    amount: zapInAmount / 2,
    slippage: 3,
    jupiterMarketUrl: "https://rpc-mainnet-fork.epochs.studio/jup/market.json",
  };

  const tokenBSwapParams: SwapParams = {
    protocol: SupportedProtocols.Jupiter,
    fromTokenMint: new anchor.web3.PublicKey(
      "So11111111111111111111111111111111111111112" // WSOL
    ),
    toTokenMint: new anchor.web3.PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" // USDC
    ),
    amount: zapInAmount / 2,
    slippage: 3,
    jupiterMarketUrl: "https://rpc-mainnet-fork.epochs.studio/jup/market.json",
  };

  // 2-2. Config addLiquidity parameters
  const poolId = new anchor.web3.PublicKey(
    "6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg" // RAY-USDC
  );

  const addLiquidityParams: AddLiquidityParams = {
    protocol: SupportedProtocols.Raydium,
    poolId,
    tokenInAmount: zapInAmount,
    version: 4,
  };

  // 2-3. Config stake parameters
  const farmId = new anchor.web3.PublicKey(
    "CHYrUBX2RKX8iBg7gYTkccoGNBzP44LdaazMHCLcdEgS" // RAY-USDC
  );

  const stakeParams: StakeParams = {
    protocol: SupportedProtocols.Raydium,
    farmId,
    version: 3,
  };

  // 2-4. Compose
  await gateway.swap(tokenASwapParams);

  // NOTICE: Here is a small work-around
  // Get swapMinOutAmount of tokenA
  const tokenAswapMinOutAmount = gateway.params.swapMinOutAmount.toNumber();
  addLiquidityParams.tokenInAmount = tokenAswapMinOutAmount;

  await gateway.swap(tokenBSwapParams);
  await gateway.addLiquidity(addLiquidityParams);
  await gateway.stake(stakeParams);

  await gateway.finalize();

  // 3. Send transactions
  // 3-1. Generate transactions
  const txs = gateway.transactions();

  // 3-2. Send all transactions
  console.log("======");
  console.log("Txs are sent...");
  for (let tx of txs) {
    const sig = await provider.sendAndConfirm(tx, [], {
      skipPreflight: true,
      commitment: "confirmed",
    } as unknown as anchor.web3.ConfirmOptions);
    console.log(sig);
  }
  console.log("Txs are executed");
  console.log("======");
};
