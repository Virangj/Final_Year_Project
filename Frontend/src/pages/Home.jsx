import React from "react";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import Notification from "../components/Notification";

const Home = () => {
  return (
    <div className="bg-black flex justify-between">
      <div>
        <Navbar />
      </div>
      <div className="py-10">
        <Feed />
      </div>
      <div className="pr-[300px]">
        <Notification />
      </div>
    </div>
  );
};

export default Home;
