import React, { useEffect, useRef } from "react";
import {motion} from "framer-motion"

const DropDown = ({ children, setShowDrop, showDrop }) => {
  const dropRef = useRef(null);

  useEffect(() => {
    const clickOutSide = (e) => {
      if (showDrop && dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDrop(false);
      }
    };
    window.addEventListener("mousedown", clickOutSide);
    return () => window.addEventListener("mousedown", clickOutSide);
  }, [ showDrop]);
  return (
    <>
      {showDrop && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.3 }}
          ref={dropRef}
          className="shadow-lg w-[8rem] bg-[#044956]/90 text-white absolute -left-28 z-10 rounded-lg "
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

export default DropDown;
