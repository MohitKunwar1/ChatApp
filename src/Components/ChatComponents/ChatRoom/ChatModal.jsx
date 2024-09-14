import React from "react";

const ChatModal = () => {
  return (
    <>
      <div className="flex flex-[2]  justify-center items-center flex-col gap-10 border-l-[1px] border-gray-400 text-white">
        <img src="/modalImage.png" alt="modalImage" className="w-[30rem] " />
        <div className="flex flex-col items-center gap-7">
          <h1 className="text-3xl font-bold">Welcome User</h1>
          <p className="text-lg font-light text-gray-400">
            Chat with friends, family and with your love ones. Always stay
            connected.
          </p>
          <div className="px-5 py-2 rounded-full border-2 border-green-700 font-light text-lg">
            Start Chating...
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatModal;
