import { useEffect, useState } from "react";
//import Think2Earn from "../../hardhat/deployments/localhost/Think2Earn.json";
// import Think2Earn from "../../hardhat/deployments/optimismSepolia/Think2Earn.json";
// import Think2Earn from "contracts/deployedContracts.ts"
import deployedContracts from "~~/contracts/deployedContracts";
import { GET_BOUNTIES } from "./queries";
import { useQuery } from "@apollo/client";
import { formatEther, keccak256, parseEther } from "viem";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import { Bounty } from "~~/types/bounty";
import { fileToByteString } from "~~/utils/fileToByteString";

const Think2Earn = deployedContracts[11155420].Think2Earn;
const MAXUINT256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

const useBounties = () => {
  const account = useAccount();
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

  const { writeContract } = useWriteContract();

  const createBounty = async (bountyData: any) => {
    await writeContract({
      address: bountiesContract.address,
      abi: bountiesContract.abi,
      functionName: "createBounty",
      value: parseEther(bountyData.reward),
      args: [
        bountyData.name,
        bountyData.description,
        bountyData.mediaURI,
        bountyData.maxProgress,
        bountyData.duration,
        bountyData.judgeTime,
      ],
    });
    return true;
  };

  const approve = async () => {
    if (account.address) {
      writeContract({
        address: bountiesContract.address,
        abi: bountiesContract.abi,
        functionName: "approve",
        args: [account.address, MAXUINT256],
      });
    } else {
      alert("Please connect your wallet to approve the contract");
    }
  };

  const submitEEGData = async (bountyId: number, eegData?: File) => {
    if (account.address && eegData) {
      const byteString = await fileToByteString(eegData);
      //  @ts-ignore
      const encodedByteString = keccak256(byteString.toString());
      await writeContract({
        address: bountiesContract.address,
        abi: bountiesContract.abi,
        functionName: "submitEEGData",
        args: [bountyId, encodedByteString],
      });
      return true;
    } else {
      alert("Please connect your wallet to submit EEG data");
      return false;
    }
  };

  useEffect(() => {
    if (isPending) setLatestTxMessage("Transaction pending...");
    else if (error) setLatestTxMessage(`Transaction failed: ${error.message}`);
    else if (hash) setLatestTxMessage(`Transaction included. ${hash}`);
    else setLatestTxMessage("");
  }, [isPending]);

  const { data: bountiesData } = useQuery(GET_BOUNTIES);

  const bountyCount = bountiesData?.bounties?.length || 0;

  const [bounties, setBounties] = useState<Bounty[]>([]);

  useEffect(() => {
    setBounties(
      bountiesData?.bounties.map((bounty: any) => {
        return {
          title: bounty.name,
          description: bounty.description,
          creator: bounty.creator,
          reward: parseInt(formatEther(bounty.reward)),
          duration: bounty.duration,
          maxProgress: parseInt(bounty.maxProgress),
          progress: bounty.submissions.length,
          submissions: bounty.submissions,
        } as Bounty;
      }) || [],
    );
  }, [bountiesData?.bounties]);

  return {
    bounties,
    bountyCount,
    approve,
    createBounty,
    submitEEGData,
    latestTxMessage,
    latestHash: hash,
    latestWriteError: error,
    fundEthBalance,
  };
};

export default useBounties;
