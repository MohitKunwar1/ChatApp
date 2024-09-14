import React, { useState } from "react";
import { IoIosArrowDropright, IoMdClose } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import SharedImages from "./SharedImages";
import OpenSharedMedia from "./OpenSharedMedia";
import { useModal } from "../../../ContextProvider/ModalContext";

const ChatInfo = ({ setShowChatInfo, messages }) => {
  const { currentUser } = useUserStore();
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlocked,
  } = useChatStore();

  const { setModal, setDeleteChatActive } = useModal();
  const [showSharedMedia, setShowSharedMedia] = useState(false);
  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlocked();
    } catch (error) {
      console.log(error);
    }
  };

  const sharedMedia = messages
    .filter((message) => message.img)
    .map((message) => message.img);

  const handleDeleteChatPopUP = () => {
    setModal(true);
    setDeleteChatActive(true);
  };

  const handleShowSharedMedia = () => {
    setShowSharedMedia(true);
  };
  return (
    <>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 text-white border-l-[1px] border-gray-400"
      >
        {!showSharedMedia ? (
          <>
            {" "}
            <div className="py-[0.6rem] px-2 flex items-center gap-[3rem]  ">
              <button
                onClick={() => {
                  setShowChatInfo(false);
                }}
              >
                <IoMdClose className="text-xl hover:bg-black/60 hover:p-1 rounded-full duration-150" />
              </button>
              <h3 className="text-xl font-light">User Info</h3>
            </div>
            <div className="userImage py-[2rem] flex flex-col items-center gap-2  border-b-[1px] border-gray-400">
              <div className="w-[10rem] h-[10rem] rounded-full overflow-hidden object-cover">
                <img
                  src={user?.avatar || "/avatar.png"}
                  alt="userimage"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-4xl font-light capitalize">
                {user?.username}
              </h2>
            </div>
            <div className="py-[0.7rem] px-[2rem] flex flex-col items-start gap-2 border-b-[1px] border-gray-400 ">
              <h4 className="text-gray-300  ">About</h4>
              <p className=" text-xl capitalize ">{user?.about}</p>
            </div>
            <div className="sharedMedia  py-3 px-3 flex flex-col  gap-5 border-b-[1px] border-gray-400">
              <div className="flex justify-between ">
                <p className="text-gray-300">Shared Media</p>
                <button onClick={handleShowSharedMedia}>
                  <IoIosArrowDropright className="text-2xl hover:scale-110 hover:text-gray-400 transition-all duration-200" />
                </button>
              </div>
              <SharedImages sharedMedia={sharedMedia} />
            </div>
            <div className="w-full flex flex-col gap-10 p-[2rem] ">
              <button
                onClick={handleDeleteChatPopUP}
                className="text-xl font-semibold bg-green-950/70 text-green-500/60 flex items-center justify-center gap-3 py-3 rounded-lg  hover:text-green-300 hover:shadow-xl active:scale-95  duration-150 "
              >
                <RiDeleteBin5Line className="text-2xl" />
                Delete Chat
              </button>
              <button
                onClick={handleBlock}
                className="text-xl font-semibold bg-red-950/70 text-red-500/60 flex items-center justify-center gap-3 py-3 rounded-lg  hover:text-red-500 hover:shadow-xl active:scale-95 duration-150 capitalize"
              >
                <MdBlock className="text-2xl" />
                {isCurrentUserBlocked
                  ? "You are blocked!"
                  : isReceiverBlocked
                  ? `${user?.username} Blocked`
                  : `Block ${user?.username}`}
              </button>
            </div>{" "}
          </>
        ) : (
          <OpenSharedMedia
            sharedMedia={sharedMedia}
            showSharedMedia={showSharedMedia}
            setShowSharedMedia={setShowSharedMedia}
          />
        )}
      </motion.div>
    </>
  );
};

export default ChatInfo;
