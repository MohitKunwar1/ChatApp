import React from "react";
import Login from "../Components/Auth/Login";
import SignUp from "../Components/Auth/SignUp";
import Overlay from "../Components/Auth/Overlay";

const Register = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center  sm:flex-row  relative ">
      <Login />
      <SignUp />
      <Overlay />
      </div>
    </>
  );
};

export default Register;
