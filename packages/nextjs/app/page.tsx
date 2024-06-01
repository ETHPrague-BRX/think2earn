"use client";

import BountyCreator from "./_components/BountyCreator";
import BountyList from "./_components/BountyList";
import data from "./_components/BountyList/data.json";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 bg-gradient-to-tr from-[#7e5dc8] to-[#84b9ee]">
        <h1 className="text-5xl">Think 2 Earn</h1>
        <h2 className="text-xl">Empowering humans to earn by helping ML models decypher visuals using BCI datasets.</h2>
        <p></p>
        <BountyCreator />
        <BountyList bounties={data} />
      </div>
    </>
  );
};

export default Home;
