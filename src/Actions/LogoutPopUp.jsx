import { signOut } from "firebase/auth";
import React from "react";
import toast from "react-hot-toast";
import { auth } from "../lib/firebaseConfig";
import { useModal } from "../ContextProvider/ModalContext";

const LogoutPopUp = () => {
  const {handleModalClose} = useModal()
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Loggedout successfuly!");
      handleModalClose();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-[30rem] h-[15rem] bg-neutral-800 p-6 text-gray-300 rounded-lg flex flex-col  justify-center gap-10 shadow-xl absolute z-50  ">
      <h4 className="text-start text-2xl font-normal">Logout</h4>
      <div>
        <p className="text-lg font-light">Are You sure you want to logout?</p>
      </div>
      <div className="text-end ">
        <button
          onClick={handleModalClose}
          className=" font-medium px-6 py-2 rounded-full border-[1px] border-green-500/60 text-green-500/60 mr-5 hover:border-green-500 hover:text-green-500 hover:shadow-lg duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleLogout}
          className="font-medium px-6 py-2 rounded-full bg-green-400/60 text-green-950 hover:bg-green-500 hover:shadow-lg duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LogoutPopUp;
