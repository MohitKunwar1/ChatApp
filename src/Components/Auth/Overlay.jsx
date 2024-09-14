import { transform } from "framer-motion";
import React, { useState } from "react";

const Overlay = () => {
  const [toggle, setToggle] = useState(true);

  return (
  <>
    <div
      className={` w-[50%] h-full absolute   flex flex-col items-center justify-center  ${
        toggle
          ? "bg-gradient-to-tl from-green-500 to-green-800 transform translate-x-[100%] transition-all duration-500 ease-in-out opacity z-10"
          : "bg-gradient-to-tl from-green-800 to-green-500  transform  transition-all duration-500 ease-in-out  z-10"
      }`}
    >
      {toggle ? (
        <div className="flex flex-col items-center gap-5 text-gray-300">
          <h1 className="text-7xl font-bold mb-10">Hello, Friend!</h1> <h3 className="text-4xl font-semibold">Don't Have Acccount!</h3>
          <p className="text-xl font-light">Create account simply by entering your details.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 text-gray-300 ">
          <h1 className="text-8xl font-bold ">Welcome </h1>
          <h1 className="text-8xl font-bold mb-10 ">Back! </h1>
          <p className="text-2xl font-light leading-4">You can login with you'r email and password,</p>
          <p className="text-2xl font-light">Connect with others.</p>
        </div>
      )}
      <button
        onClick={() => setToggle(!toggle)}
        className={`text-2xl font-medium bg-transparent px-20 py-2 rounded-full border-[1px] border-black shadow-lg text-white mt-10 `}
      >
        {toggle ? "Signup" : "Login"}
      </button>
    </div>
  </>
  );
};

export default Overlay;
