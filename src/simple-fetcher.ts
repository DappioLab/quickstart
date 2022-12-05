import { Connection } from "@solana/web3.js";
import {
  raydium,
  saber,
  orca,
  lifinity,
  larix,
  IPoolInfoWrapper,
  IFarmInfoWrapper,
} from "@dappio-wonderland/navigator";

export const fetch = async () => {
  // 1. Create a RPC connection

  // Cache RPC for mainnet
  const connection = new Connection("https://cache-rpc.dappio.xyz", {
    commitment: "confirmed",
    wsEndpoint: "wss://cache-rpc.dappio.xyz/ws",
  });

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

  // 3-1. Sort by APR
  // NOTICE: The calculation of APR requires correct trading volume and lp price
  // thus the example here DOES NOT reflect the actual APR
  const sortedRaydiumPools = raydiumPools.sort((a, b) => b.getApr(100, 1) - a.getApr(100, 1));
  const sortedSaberPools = saberPools.sort((a, b) => b.getApr(100, 1) - a.getApr(100, 1));
  const sortedOrcaPools = orcaPools.sort((a, b) => b.getApr(100, 1) - a.getApr(100, 1));
  const sortedLifinityPools = lifinityPools.sort((a, b) => b.getApr(100, 1) - a.getApr(100, 1));

  // NOTICE: The calculation of APRs requires correct lp price and reward price
  // thus the example here DOES NOT reflect the actual APRs
  const sortedRaydiumFarms = raydiumFarms.sort((a, b) => b.getAprs(1, 1)[0] - a.getAprs(1, 1)[0]);
  const sortedSaberFarms = saberFarms.sort((a, b) => b.getAprs(1, 1)[0] - a.getAprs(1, 1)[0]);
  const sortedOrcaFarms = orcaFarms.sort((a, b) => b.getAprs(1, 1)[0] - a.getAprs(1, 1)[0]);
  const sortedLarixFarms = larixFarms.sort((a, b) => b.getAprs(1, 1)[0] - a.getAprs(1, 1)[0]);

  // 3-2. Store sorted infos in set
  let sortedPools = new Map<String, IPoolInfoWrapper[]>();
  let sortedFarms = new Map<String, IFarmInfoWrapper[]>();

  sortedPools.set("Raydium", sortedRaydiumPools);
  sortedPools.set("Saber", sortedSaberPools);
  sortedPools.set("Orca", sortedOrcaPools);
  sortedPools.set("Lifinity", sortedLifinityPools);

  sortedFarms.set("Raydium", sortedRaydiumFarms);
  sortedFarms.set("Saber", sortedSaberFarms);
  sortedFarms.set("Orca", sortedOrcaFarms);
  sortedFarms.set("Larix", sortedLarixFarms);

  // 4. Display the top 3 pools/farms with the highest APR for each protocol

  sortedPools.forEach((value, key) => {
    console.log("======");
    console.log(`Top 3 ${key} pools that have the highest APR: `);

    const slicedInfos = value.slice(0, 3);
    slicedInfos.forEach((info) => {
      console.log(`https://solana.fm/address/${info.poolInfo.poolId.toString()}`);
    });
  });

  sortedFarms.forEach((value, key) => {
    console.log("======");
    console.log(`Top 3 ${key} farms that have the highest APR: `);

    const slicedInfos = value.slice(0, 3);
    slicedInfos.forEach((info) => {
      console.log(`https://solana.fm/address/${info.farmInfo.farmId.toString()}`);
    });
  });
};
