"use client";

import { useEffect, useRef } from "react";
import BountyCreator from "./_components/BountyCreator";
import BountyList from "./_components/BountyList";
import data from "./_components/BountyList/data.json";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // document.querySelector("video").defaultPlaybackRate = 0.5;
      // document.querySelector("video").playbackRate = 0.5;
      // videoRef?.current?.setAttribute("defaultPlaybackRate", "0.5");
    }
  }, []);
  return (
    <>
      <div className="w-[100vw] h-[100vh] overflow-x-hidden bg-[#00000033]">
        <div className="z-2 flex items-center flex-col flex-grow pt-10">
          <h1 className="text-5xl drop-shadow-xl">Think 2 Earn</h1>
          <h2 className="text-xl drop-shadow-md">
            Empowering humans to earn by helping ML models decypher visuals using BCI datasets.
          </h2>
          <p></p>
          <BountyCreator />
          <BountyList bounties={data} />
        </div>
      </div>
    </>
  );
};

export default Home;
