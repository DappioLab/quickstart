import { Connection } from "@solana/web3.js";
import {
  raydium,
  saber,
  orca,
  lifinity,
  larix,
  tulip,
  friktion,
  IPoolInfoWrapper,
  IFarmInfoWrapper,
  IVaultInfoWrapper,
} from "@dappio-wonderland/navigator";

export const fetch = async () => {
  // 1. Create a RPC connection

  // Cache RPC for mainnet
  const connection = new Connection("https://cache-rpc.dappio.xyz", {
    commitment: "confirmed",
    wsEndpoint: "wss://cache-rpc.dappio.xyz/ws",
  });
  // const connection = new Connection("https://rpc-mainnet-fork.epochs.studio", {
  //   commitment: "confirmed",
  //   wsEndpoint: "wss://rpc-mainnet-fork.epochs.studio/ws",
  //   confirmTransactionInitialTimeout: 300 * 1000,
  // });

  // 2-1. Fetch Pools

  const raydiumPools = await raydium.infos.getAllPoolWrappers(connection);
  console.log(`${raydiumPools.length} Raydium Pools are fetched.`);

  const saberPools = await saber.infos.getAllPoolWrappers(connection);
  console.log(`${saberPools.length} Saber Pools are fetched.`);

  const orcaPools = await orca.infos.getAllPoolWrappers(connection);
  console.log(`${orcaPools.length} Orca Pools are fetched.`);

  const lifinityPools = await lifinity.infos.getAllPoolWrappers(connection);
  console.log(`${lifinityPools.length} Lifinity Pools are fetched.`);

  // 2-2. Fetch Farms

  const raydiumFarms = await raydium.infos.getAllFarmWrappers(connection);
  console.log(`${raydiumFarms.length} Raydium Farms are fetched.`);

  const saberFarms = await raydium.infos.getAllFarmWrappers(connection);
  console.log(`${saberFarms.length} Saber Farms are fetched.`);

  const orcaFarms = await raydium.infos.getAllFarmWrappers(connection);
  console.log(`${orcaFarms.length} Orca Farms are fetched.`);

  const larixFarms = await larix.infos.getAllFarmWrappers(connection);
  console.log(`${larixFarms.length} Larix Farms are fetched.`);

  // 2-3. Fetch Vaults

  const tulipVaults = await tulip.infos.getAllVaultWrappers(connection);
  console.log(`${tulipVaults.length} Tulip Vaults are fetched.`);

  const friktionVaults = await friktion.infos.getAllVaultWrappers(connection);
  console.log(`${friktionVaults.length} Friktion Vaults are fetched.`);

  // 3-1. Sort by APY

  // NOTICE: The calculation of APY requires correct trading volume and lp price
  // thus the example here DOES NOT reflect the actual APY
  const sortedRaydiumPools = raydiumPools.sort((a, b) => b.getAPY(100, 1) - a.getAPY(100, 1));
  const sortedSaberPools = saberPools.sort((a, b) => b.getAPY(100, 1) - a.getAPY(100, 1));
  const sortedOrcaPools = orcaPools.sort((a, b) => b.getAPY(100, 1) - a.getAPY(100, 1));
  const sortedLifinityPools = lifinityPools.sort((a, b) => b.getAPY(100, 1) - a.getAPY(100, 1));

  // NOTICE: The calculation of APYs requires correct lp price and reward price
  // thus the example here DOES NOT reflect the actual APYs
  const sortedRaydiumFarms = raydiumFarms.sort((a, b) => b.getAPYs(1, 1)[0] - a.getAPYs(1, 1)[0]);
  const sortedSaberFarms = saberFarms.sort((a, b) => b.getAPYs(1, 1)[0] - a.getAPYs(1, 1)[0]);
  const sortedOrcaFarms = orcaFarms.sort((a, b) => b.getAPYs(1, 1)[0] - a.getAPYs(1, 1)[0]);
  const sortedLarixFarms = larixFarms.sort((a, b) => b.getAPYs(1, 1)[0] - a.getAPYs(1, 1)[0]);

  // NOTICE: The calculation of APY requires correct lp price and reward price
  // thus the example here DOES NOT reflect the actual APY
  const sortedTulipVaults = tulipVaults.sort((a, b) => b.getAPY() - a.getAPY());
  const sortedFriktionVaults = friktionVaults.sort((a, b) => b.getAPY() - a.getAPY());

  // 3-2. Store sorted infos in set

  let sortedPools = new Map<String, IPoolInfoWrapper[]>();
  let sortedFarms = new Map<String, IFarmInfoWrapper[]>();
  let sortedVaults = new Map<String, IVaultInfoWrapper[]>();

  sortedPools.set("Raydium", sortedRaydiumPools);
  sortedPools.set("Saber", sortedSaberPools);
  sortedPools.set("Orca", sortedOrcaPools);
  sortedPools.set("Lifinity", sortedLifinityPools);

  sortedFarms.set("Raydium", sortedRaydiumFarms);
  sortedFarms.set("Saber", sortedSaberFarms);
  sortedFarms.set("Orca", sortedOrcaFarms);
  sortedFarms.set("Larix", sortedLarixFarms);

  sortedVaults.set("Tulip", sortedTulipVaults);
  sortedVaults.set("Friktion", sortedFriktionVaults);

  // 4. Display the top 3 pools/farms with the highest APY for each protocol

  sortedPools.forEach((value, key) => {
    console.log("======");
    console.log(`Top 3 ${key} pools that have the highest APY: `);

    const slicedInfos = value.slice(0, 3);
    slicedInfos.forEach((info) => {
      console.log(`https://solana.fm/address/${info.poolInfo.poolId.toString()}`);
    });
  });

  sortedFarms.forEach((value, key) => {
    console.log("======");
    console.log(`Top 3 ${key} farms that have the highest APY: `);

    const slicedInfos = value.slice(0, 3);
    slicedInfos.forEach((info) => {
      console.log(`https://solana.fm/address/${info.farmInfo.farmId.toString()}`);
    });
  });

  sortedVaults.forEach((value, key) => {
    console.log("======");
    console.log(`Top 3 ${key} vaults that have the highest APY: `);

    const slicedInfos = value.slice(0, 3);
    slicedInfos.forEach((info) => {
      console.log(`https://solana.fm/address/${info.vaultInfo.vaultId.toString()}`);
    });
  });
};
