import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { MdEmojiEmotions, MdMoreVert } from "react-icons/md";
import DropDown from "../../../utils/DropDown.jsx";
import ChatInfo from "../ChatInfo/ChatInfo.jsx";
import { db } from "../../../lib/firebaseConfig.js";
import {
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { useChatStore } from "../../../lib/chatStore.js";
import { useUserStore } from "../../../lib/userStore.js";
import upload from "../../../lib/upload.js";
import { useModal } from "../../../ContextProvider/ModalContext.jsx";

const ChatRoom = () => {
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
    const {setModal, setDeleteChatActive, setClearChatActive} = useModal()
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState();
  const [showDrop, setShowDrop] = useState(false);
  const [ShowChatInfo, setShowChatInfo] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const endRef = useRef(null);
  const emojiHandler = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (text === "") return;

    let imgUrl = null;

    setLoading(true);
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
          clearedChat: [],
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();

          const chatIndex = userChatData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatData.chats[chatIndex].lastMessage = text;
          userChatData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    setImg({
      file: null,
      url: "",
    });

    setText("");
  };

  const handleDropDown = () => {
    setShowDrop(!showDrop);
  };

  const handleChatInfo = () => {
    setShowChatInfo(true);
    setShowDrop(false);
  };

  const handleClearChatPopUp = () => {
    setModal(true);
    setShowDrop(false);
    setClearChatActive(true)
  };

  return (
    <>
      <div className=" flex flex-[2]  justify-between flex-col border-l-[1px] border-gray-400 text-white">
        <div className="chatInfo p-[0.5rem] flex justify-between gap-5 px-5 border-b-[1px] border-gray-400">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar || "/avatar.png"}
              alt="userimage"
              className="w-[3rem] h-[3rem] rounded-full cursor-pointer object-cover"
            />
            <h3 className="text-2xl capitalize">{user?.username}</h3>
          </div>
          <div className=" flex items-center justify-evenly text-2xl ">
            <div className="relative">
              <button onClick={handleDropDown}>
                <MdMoreVert />
              </button>
              <DropDown showDrop={showDrop} setShowDrop={setShowDrop}>
                <Button click={handleClearChatPopUp} title="Clear Chat" />
                <Button click={handleChatInfo} title="Chat Info" />
              </DropDown>
            </div>
          </div>
        </div>
        <div className="chatBlock h-full flex-1 p-4  flex flex-col gap-5  overflow-y-scroll scroll-smooth no-scrollbar  ">
          {chat?.messages
            ?.filter(
              (message) => !message.clearedChat.includes(currentUser?.id)
            )
            .map((message, i) => (
              <div
                key={i}
                className={`${
                  message.senderId === currentUser?.id
                    ? "bg-blue-700/20 backdrop-blur-lg backdrop-filter rounded-lg self-end flex "
                    : "yourText bg-white/20 backdrop-blur-lg backdrop-filter rounded-lg self-start "
                } text max-w-[70%] flex gap-5 p-2`}
              >
                <div className="text flex-1 flex flex-col gap-[5px] ">
                  {message.img && (
                    <img
                      src={message.img}
                      alt="sharedImage"
                      className="w-full h-[20rem] object-cover rounded-md"
                    />
                  )}
                  <p className="text-sm ">{message.text}</p>
                </div>
              </div>
            ))}
          {img.url && (
            <div className="text w-full h-[20rem] object-cover rounded-md">
              <div className="text">
                <img src={img.url} alt="image" />
              </div>
            </div>
          )}
          {/* <div ref={endRef}></div> */}
        </div>
        <div className=" messageBlock p-[1rem] flex  items-center gap-5 px-5 border-t-[1px] border-gray-400">
          <div className=" emoji relative text-2xl cursor-pointer">
            <MdEmojiEmotions onClick={() => setOpen((prev) => !prev)} />
            <div className="emojiPicker absolute bottom-[45px] left-[-20px]">
              <EmojiPicker open={open} onEmojiClick={emojiHandler} />
            </div>
          </div>
          <label htmlFor="file">
            <IoMdAdd className="text-2xl cursor-pointer" />
          </label>
          <input type="file" id="file" onChange={handleImage} hidden />
          <div className=" flex flex-1 items-center   ">
            <input
              onChange={(e) => {
                setText(e.target.value);
              }}
              // disabled={isCurrentUserBlocked || isReceiverBlocked}
              value={text}
              type="text"
              name="text"
              autoComplete="off"
              disabled={isCurrentUserBlocked || isReceiverBlocked || loading}
              placeholder={`${
                isCurrentUserBlocked || isReceiverBlocked
                  ? "You can not send message."
                  : "Type Message..."
              }`}
              className={`w-full h-8 rounded-md pl-2 outline-none  bg-black/70  border-white/30 ${
                isCurrentUserBlocked || isReceiverBlocked
                  ? "cursor-not-allowed text-sm text-white/50"
                  : ""
              }`}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={isCurrentUserBlocked || isReceiverBlocked || loading}
            className={`${
              isCurrentUserBlocked || isReceiverBlocked || loading
                ? "cursor-not-allowed text-blue-700/50"
                : "cursor-pointer "
            }`}
          >
            <IoSendSharp className="text-2xl" />
          </button>
          <FaMicrophone className="text-xl" />
        </div>
      </div>
      {ShowChatInfo && (
        <ChatInfo
          ShowChatInfo={ShowChatInfo}
          setShowChatInfo={setShowChatInfo}
          setModal={setModal}
          setDeleteChatActive={setDeleteChatActive}
          messages={chat?.messages || []}
        />
      )}
    </>
  );
};

export default ChatRoom;

const Button = ({ click, title }) => {
  return (
    <>
      <button
        onClick={click}
        className={`p-2  hover:bg-black/40 hover:backdrop-filter hover:backdrop-blur-lg rounded-lg w-full text-lg  text-left transition-all duration-150 ${
          title === "Chat Info" ? "text-[#22ffff] hover:text-white" : ""
        }`}
      >
        {title}
      </button>
    </>
  );
};
