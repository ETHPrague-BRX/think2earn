import { useEffect, useState } from "react";
import Think2Earn from "../../hardhat/deployments/localhost/Think2Earn.json";
import { formatEther } from "viem";
import { useBalance, useContractReads, useWriteContract } from "wagmi";
import { Bounty } from "~~/types/bounty";

export interface Asset {
  priceFeed: string;
  tokenNum: string;
  tokenDen: string;
  tokenAmount: bigint;
  initPrice: bigint;
}

type ContractReadsOutput = {
  data?: any[];
  isError: boolean;
  isLoading: boolean;
};

const useBounties = () => {
  const fundEthBalance = useBalance({
    address: Think2Earn.address,
  });
  const [latestTxMessage, setLatestTxMessage] = useState<string>("");
  const { data: hash, isPending, error } = useWriteContract();

  useEffect(() => {
    if (isPending) setLatestTxMessage("Transaction pending...");
    else if (error) setLatestTxMessage(`Transaction failed: ${error.message}`);
    else if (hash) setLatestTxMessage(`Transaction included. ${hash}`);
    else setLatestTxMessage("");
  }, [isPending]);

  const bountiesContract = {
    address: Think2Earn.address,
    abi: Think2Earn.abi as any,
  } as const;

  const { data, isError, isLoading }: ContractReadsOutput = useContractReads({
    contracts: [
      {
        ...bountiesContract,
        functionName: "getBountyCount",
      },
      {
        ...bountiesContract,
        functionName: "getBountyDetails",
        args: [1],
      },
    ],
  });

  const bounties: Bounty[] =
    !isLoading && data && data[0].status === "success"
      ? [
          {
            title: data[1].result[0],
            description: data[1].result[1],
            reward: parseFloat(formatEther(data[1].result[3])),
            duration: data[1].result[4],
            //   judgeTime: data[1].result[5],
            maxProgress: parseInt(data[1].result[6]),
            progress: parseInt("0"),
            creator: data[1].result[7],
            //   isActive: data[1].result[9],
          },
        ]
      : [];

  const bountyCount = !isLoading && data && data[0].status === "success" ? data[0].result : 0;

  return {
    bounties,
    bountyCount,
    latestTxMessage,
    latestHash: hash,
    latestWriteError: error,
    fundEthBalance,
    isError,
    isLoading: isLoading || isPending,
  };
};

export default useBounties;
