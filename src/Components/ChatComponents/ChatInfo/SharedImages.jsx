import React from "react";

const SharedImages = ({ sharedMedia }) => {
  return (
    <>
      <div className=" w-full flex gap-3   ">
      {sharedMedia.slice(0, 3).map((img, index) => (
        <div className="mediaImage w-[4rem] h-[4rem] rounded-md overflow-hidden object-cover cursor-pointer hover:shadow-xl hover:bg-black/60  ">
          <img
            key={index}
            src={img}
            alt="sharedmedia"
            className="w-full h-full object-cover opacity-75  "
          />
        </div>
      ))}
      {
        sharedMedia.length > 3 && (
          <div className=" flex items-end justify-center text-xl text-gray-400">..........</div>
        )
      }
      </div>
    </>
  );
};

export default SharedImages;
