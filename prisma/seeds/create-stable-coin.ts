import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function createStableCoins(group) {
  const chains = await prisma.chain.findMany();
  const BNBTestnet = chains.find((i) => i.chainid === 97);
  const BNBMainet = chains.find((i) => i.chainid === 56);
  const EthMainet = chains.find((i) => i.chainid === 1);
  const BaseMainet = chains.find((i) => i.chainid === 8453);
  const ArbitrumMainet = chains.find((i) => i.chainid === 42161);
  const PolygonMainet = chains.find((i) => i.chainid === 137);
  return prisma.mStableCoin.createMany({
    data: [
      {
        chainId: BNBTestnet.id,
        stableCoinGroupId: group.id,
        address: '0xb3b6B63d163C6d149b7f89Ee6c308CD9fD4b2734',
        decimal: 6,
      },
      {
        chainId: BNBMainet.id,
        stableCoinGroupId: group.id,
        address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        decimal: 18,
      },
      {
        chainId: EthMainet.id,
        stableCoinGroupId: group.id,
        address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimal: 6,
      },
      {
        chainId: BaseMainet.id,
        stableCoinGroupId: group.id,
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        decimal: 6,
      },
      {
        chainId: ArbitrumMainet.id,
        stableCoinGroupId: group.id,
        address: '0xaf88d065E77c8cC2239327c5EDb3A432268e5831',
        decimal: 6,
      },
      {
        chainId: PolygonMainet.id,
        stableCoinGroupId: group.id,
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        decimal: 6,
      },
    ],
  });
}
