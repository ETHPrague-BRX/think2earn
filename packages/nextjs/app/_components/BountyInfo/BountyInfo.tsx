import { useState } from "react";
import styles from "./BountyInfo.module.scss";
import { IoIosDownload } from "react-icons/io";
import { Bounty } from "~~/types/bounty";

export type BountyInfoProps = Bounty & {
  progress: number;
  onClick: (i: string) => void;
};

const BountyInfo: React.FC<BountyInfoProps> = ({
  title,
  description,
  creator,
  reward,
  duration,
  progress,
  maxProgress,
  onClick,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      setFile(file);
    }
  };

  return (
    <div className={`flex flex-col gap-2 bg-slate-800 p-10 w-[100%] minh-[400px] rounded justify-between`}>
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
        <div className={styles.buttonWrapper}>
          <button className={`w-[100%] bg-slate-400 rounded pb-2 pt-2 ${styles.button} text-center`}>
            <div className="flex gap-2 align-center justify-center text-center">
              <IoIosDownload className="mt-auto mb-auto" /> <span>Download Resources</span>
            </div>
          </button>
          <div className={`${styles.button} w-[100%] bg-slate-400 rounded pb-2 pt-2 pl-8 pr-8`}>
            <label htmlFor="files">Upload Dataset</label>
            <input
              id="files"
              style={{ display: "none" }}
              type="file"
              accept=".csv, .pth, .jpeg"
              onChange={uploadFile}
            ></input>
          </div>
        </div>
        {file && <p className="m-auto mt-4">{file.name}</p>}
        {file && (
          <button className={`w-[100%] bg-green-500 rounded pb-2 pt-2 ${styles.button} text-center`}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default BountyInfo;
