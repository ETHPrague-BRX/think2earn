import { useState } from "react";
import Backdrop from "../Backdrop/Backdrop";
import Bounty, { BountyProps } from "../Bounty/Bounty";
import BountyInfo from "../BountyInfo";
import { AnimatePresence, motion } from "framer-motion";
import useBounties from "~~/hooks/useBounties";

type BountyListProps = {
  bounties: BountyProps[];
};

const BountyList: React.FC<BountyListProps> = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { bounties, bountyCount } = useBounties();

  return (
    <div className="p-8 w-[100%]">
      <p className="text-left ml-0">{parseInt(bountyCount)} bounties found</p>
      <div className="flex gap-4 flex-wrap items-center justify-between">
        {bounties.map((bounty, i) => {
          return (
            <div key={`bounty-${i}`} onClick={() => setSelectedId(i)}>
              <Bounty {...bounty} />
            </div>
          );
        })}
        <AnimatePresence>
          {selectedId !== null && (
            <motion.div layoutId={selectedId}>
              <Backdrop onClick={() => setSelectedId(null)}>
                <BountyInfo {...bounties[selectedId]} />
              </Backdrop>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BountyList;
