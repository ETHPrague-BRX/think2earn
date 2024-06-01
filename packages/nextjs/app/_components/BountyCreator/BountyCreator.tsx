import { useState } from "react";
import Backdrop from "../Backdrop";
import styles from "./BountyCreator.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosDownload } from "react-icons/io";

const BountyCreator = () => {
  const [openCreator, setOpenCreator] = useState<boolean>(false);
  return (
    <div>
      <button
        onClick={() => setOpenCreator(true)}
        className={`w-[100%] bg-indigo-400 rounded pr-8 pl-8 pb-2 pt-2 ${styles.button} text-center`}
      >
        <div className="flex gap-2 align-center justify-center text-center">
          {/* @ts-ignore */}
          <IoIosDownload className="mt-auto mb-auto" /> <span>Create Bounty</span>
        </div>
      </button>
      <AnimatePresence>
        {openCreator && (
          <motion.div>
            <Backdrop onClick={() => setOpenCreator(false)}>
              <div>Hello</div>
            </Backdrop>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BountyCreator;
