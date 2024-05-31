import { useRef, useState } from "react";
import styles from "./Bounty.module.scss";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Bounty as BountyType } from "~~/types/bounty";

export type BountyProps = BountyType & {
  progress: number;
};

const Bounty: React.FC<BountyProps> = ({ title, description, creator, reward, duration, progress, maxProgress }) => {
  return (
    <div
      className={`${styles.Bounty} flex flex-col gap-2 bg-slate-800 p-10 w-[300px] minh-[400px] rounded justify-between`}
    >
      <div>
        <h3 className="text-xl">{title}</h3>
        <p className="text-md">by {creator}</p>
        <p className="text-sm h-[100px] line-clamp-4">{description}</p>
      </div>
      <div className="flex flex-col gap-1 mb-4">
        <label>
          {progress} / {maxProgress}
        </label>
        <label>Reward: {reward} ETH</label>
      </div>
      <div className="flex flex-col gap-2">
        <p className="m-auto text-sm">Ends in 3d 7h 41min</p>
        <button className={`bg-slate-400 rounded pb-2 pt-2 ${styles.button}`}>Join</button>
      </div>
    </div>
  );
};

export default Bounty;
