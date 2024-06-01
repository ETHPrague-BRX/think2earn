import { useState } from "react";
import Backdrop from "../Backdrop/Backdrop";
import Bounty, { BountyProps } from "../Bounty/Bounty";
import BountyInfo from "../BountyInfo";
import { AnimatePresence, motion } from "framer-motion";

type BountyListProps = {
  bounties: BountyProps[];
};

const BountyList: React.FC<BountyListProps> = ({ bounties }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-8">Current bounties</h2>
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
