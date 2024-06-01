// @ts-nocheck
import { useState } from "react";
import Backdrop from "../Backdrop";
import styles from "./BountyCreator.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosAddCircle } from "react-icons/io";
import useBounties from "~~/hooks/useBounties";

const BountyCreator = () => {
  const [openCreator, setOpenCreator] = useState<boolean>(false);

  const { createBounty, approve } = useBounties();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bounty = {
      name: e.target[0].value,
      description: e.target[1].value,
      mediaURI: e.target[2].value,
      reward: e.target[3].value,
      maxProgress: parseInt(e.target[4].value),
      duration: parseInt(e.target[5].value),
      judgeTime: 14000,
    };
    await approve().then(() => {
      createBounty(bounty);
    });
    alert("Bounty created! Reload the page to see it.");
  };

  return (
    <div>
      <button
        onClick={() => setOpenCreator(true)}
        className={`w-[100%] bg-indigo-400 rounded pr-8 pl-8 pb-2 pt-2 ${styles.button} text-center`}
      >
        <div className="flex gap-2 align-center justify-center text-center">
          {/* @ts-ignore */}
          <IoIosAddCircle className="mt-auto mb-auto" /> <span>Create Bounty</span>
        </div>
      </button>
      <AnimatePresence>
        {openCreator && (
          <motion.div>
            <Backdrop onClick={() => setOpenCreator(false)}>
              <form
                onSubmit={handleSubmit}
                className={`${styles.BountyCreator} flex flex-col gap-2 bg-slate-800 p-10 w-[400px] minh-[400px] rounded justify-between`}
              >
                <h2>Create a bounty</h2>
                <input className="p-2 rounded" placeholder="Name" required></input>
                <textarea
                  className="p-2 h-[8rem] rounded"
                  placeholder="Description (max. 256 characters)"
                  required
                ></textarea>
                <input className="p-2 rounded" placeholder="Resource URL" required></input>
                <input className="p-2 rounded" placeholder="Reward (ETH)" required type="number"></input>
                <input className="p-2 rounded" placeholder="Participants" required type="number"></input>
                <input className="p-2 rounded" placeholder="Bounty Duration (in blocks)" required type="number"></input>
                <button
                  type="submit"
                  className={`w-[100%] bg-indigo-400 rounded pb-2 pt-2 ${styles.button} text-center`}
                >
                  <div className="flex gap-2 align-center justify-center text-center">
                    {/* @ts-ignore */}
                    <IoIosAddCircle className="mt-auto mb-auto" /> <span>Create</span>
                  </div>
                </button>
              </form>
            </Backdrop>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BountyCreator;
