import styles from "./Bounty.module.scss";
import { IoIosLock } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Bounty as BountyType } from "~~/types/bounty";

export type BountyProps = BountyType & {
  progress: number;
};

const Bounty: React.FC<BountyProps> = ({ title, description, creator, reward, duration, progress, maxProgress }) => {
  const joined = Math.random() > 0.5 ? false : true;
  const finished = progress >= maxProgress;

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
        <p className="m-auto text-sm">{finished ? "Bounty has concluded" : `Ends in ${duration}`}</p>
        {finished && !joined && (
          <label className="m-auto border-[1px] border-slate-400 w-[100%] text-center pb-2 pt-2 rounded flex gap-2 items-center justify-center">
            <IoIosLock /> Ended
          </label>
        )}
        {joined && (
          <label className="m-auto border-[1px] border-slate-400 w-[100%] text-center pb-2 pt-2 rounded flex gap-2 items-center justify-center">
            <IoCheckmarkCircleOutline /> Joined
          </label>
        )}
        {!joined && !finished && <button className={`bg-slate-400 rounded pb-2 pt-2 ${styles.button}`}>Join</button>}
      </div>
    </div>
  );
};

export default Bounty;
