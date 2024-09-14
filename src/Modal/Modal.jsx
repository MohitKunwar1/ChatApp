import React from "react";
import { useModal } from "../ContextProvider/ModalContext";

const Modal = ({ children}) => {
  const {modal} = useModal();
  return (
    <div
      className={`w-[100%] bg-black/50 h-full flex items-center justify-center ${
        modal ? "visible opacity-100%" : "invisible opacity-0"
      } transition-all duration-200 absolute `}
    >
      <div className=" h-fit w-fit flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Modal;
