import React from "react";
import { GoArrowLeft } from "react-icons/go";
import ChatInfo from "./ChatInfo";

const OpenSharedMedia = ({ sharedMedia, showSharedMedia, setShowSharedMedia }) => {
  return (
    <>
    {
      showSharedMedia ?
      <div className="flex-1 h-full flex flex-col ">
      <div className=" p-5 flex items-center gap-10">
        <button onClick={() => setShowSharedMedia(false)}  className="text-2xl hover:text-gray-400 duration-150">
        <GoArrowLeft title="Go Back"/>
        </button>
        <p className="text-lg ">Shared Media</p>
      </div>
  <div className=" flex flex-wrap p-5 gap-4 items-center ">
    {sharedMedia.map((img, index) => (
  <div className="  w-[6rem] h-[6rem] ">
        <img
          key={index}
          src={img}
          alt="sharedmedia"
          className="w-full h-full object-cover rounded-lg hover:shadow-xl duration-150 cursor-pointer"/>
    </div>
      ))}
  </div>
    </div> : <ChatInfo />
    }
    </>
  );
};

export default OpenSharedMedia;
