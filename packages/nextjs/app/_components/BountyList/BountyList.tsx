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
    <div className="flex gap-4 flex-wrap items-center justify-evenly">
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
  );
};

export default BountyList;
