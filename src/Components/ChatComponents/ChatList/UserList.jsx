import React, { useEffect, useState } from "react";
import { IoPersonAddSharp, IoSearch } from "react-icons/io5";
import { MdMoreVert } from "react-icons/md";
import AddNewUser from "./AddNewUser.jsx";
import DropDown from "../../../utils/DropDown.jsx";
import { db } from "../../../lib/firebaseConfig.js";
import { useUserStore } from "../../../lib/userStore.js";
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useChatStore } from "../../../lib/chatStore.js";
import EditProfile from "./EditProfile.jsx";
import { useModal } from "../../../ContextProvider/ModalContext.jsx";

const UserList = () => {
  const [openNewUser, setOpenNewUser] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [input, setInput] = useState("");
  const [unRead, setUnRead] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  const {setModal, setLogoutActive, setDeleteAccountActive} = useModal()

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data()?.chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
    } catch (error) {
      console.log(error);
    }
    changeChat(chat.chatId, chat.user);
  };

  const handlenewUserBlock = () => {
    setOpenNewUser(true);
  };

  const handleLogoutPopUp = () => {
    setModal(true);
    setLogoutActive(true);
    setShowDrop(false);
  };

  const handleDeleteAccount = () => {
    setModal(true)
    setDeleteAccountActive(true);
    setShowDrop(false)
  };
  

  const handleEditProfile = () => {
    setEditProfile(true);
  };

  const handleDropDown = () => {
    setShowDrop(!showDrop);
  };

  const filteredChats = chats.filter((c) =>
    c.user?.username?.toLowerCase().includes(input.toLowerCase())
  );

  // filter unread chats
  const filterUnReadChats = chats.filter(
    (c) =>
      c.isSeen === false &&
      c.user?.username?.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className=" font-rubrick flex-[1] h-full  text-gray-100">
      {openNewUser ? (
        <AddNewUser />
      ) : editProfile ? (
        <EditProfile />
      ) : (
        <>
          <div className="top  ">
            <div className="userinfo p-[0.5rem] flex   gap-5 ">
              <div className="flex flex-1 items-center justify-evenly ">
                <img
                  src={currentUser.avatar || "/avatar.png"}
                  alt="userimage"
                  className="w-[3rem] h-[3rem] rounded-full  object-cover "
                />
                <h3 className="text-xl capitalize">{currentUser.username}</h3>
              </div>
              <div className="flex flex-1 items-center justify-evenly   ">
                <button
                  onClick={handlenewUserBlock}
                  className="relative flex items-center  gap-5 px-10   rounded-full duration-200 group "
                >
                  <IoPersonAddSharp className="absolute left-0  text-xl " />
                  <p className="absolute left-0 opacity-0 text-sm font-light transition-all duration-200  group-hover:opacity-100 group-hover:left-5 group-hover:z-10">
                    Add User
                  </p>
                </button>
                <div className="relative ">
                  <button
                    onClick={handleDropDown}
                    className="text-2xl flex "
                    title="More"
                  >
                    <MdMoreVert />
                  </button>
                   
                    <DropDown showDrop={showDrop} setShowDrop={setShowDrop}>
                      <Button click={handleEditProfile} title="Edit Profile" />
                      <Button click={handleLogoutPopUp} title="Logout" />
                      <Button
                        click={handleDeleteAccount}
                        title="Delete Account"
                      />
                    </DropDown>
                  
                </div>
              </div>
            </div>
            <div className="searchchat h-[2.5rem]  flex  justify-center mt-4   ">
              <div className="w-[90%] h-full flex items-center justify-center p-2 gap-2 rounded-md overflow-hidden text-center bg-black/60">
                <IoSearch className="text-xl " />
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-transparent flex-1 pl-2 border-none outline-none capitalize"
                />
              </div>
            </div>
          </div>
          <div className="filter p-[1.5rem] flex  items-center gap-4 px-5 text-gray-300">
            <button
              onClick={() => setUnRead(false)}
              className={` text-lg font-light px-3 py-1 rounded-full  bg-black/60 hover:shadow-lg duration-150 active:scale-95 ${
                !unRead && "bg-green-950 text-green-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setUnRead(true)}
              className={`text-lg font-light px-3 py-1 rounded-full  bg-black/60 hover:shadow-lg duration-150 active:scale-95 ${
                unRead && "bg-green-950 text-green-600"
              }`}
            >
              Unread
            </button>
          </div>
          <div className="userslist flex-1 h-full overflow-scroll scroll-smooth no-scrollbar ">
            {unRead
              ? filterUnReadChats.map((chat, index) => (
                  <div
                    key={`${chat.chatId}  - ${index}`}
                    onClick={() => handleSelect(chat)}
                    className={`chatUser py-[1rem] border-b-[1px] border-gray-400 flex items-center gap-2 justify-evenly cursor-pointer ${
                      chat?.isSeen
                        ? "bg-transparent"
                        : "bg-red-700/20 backdrop-filter backdrop-blur-lg"
                    }`}
                  >
                    <div className="w-[3rem] h-[3rem] rounded-full cursor-pointer overflow-hidden ">
                      <img
                        src={chat?.user.avatar || "/avatar.png"}
                        alt="userimage"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="h-full w-[75%] flex flex-col justify-center gap-2 ">
                      <div className="flex items-center justify-between ">
                        <h3 className="text-2xl font-light capitalize">
                          {chat?.user.username}
                        </h3>
                      </div>
                      <p className="text-xs font-thin">{chat.lastMessage}</p>
                    </div>
                  </div>
                ))
              : filteredChats.map((chat) => (
                  <div
                    key={chat.chatId}
                    onClick={() => handleSelect(chat)}
                    className={`chatUser py-[1rem] border-b-[1px] border-gray-400 flex items-center gap-2 justify-evenly cursor-pointer ${
                      chat?.isSeen
                        ? "bg-transparent"
                        : "bg-red-700/20 backdrop-filter backdrop-blur-lg"
                    }`}
                  >
                    <div className="w-[3rem] h-[3rem] rounded-full cursor-pointer overflow-hidden ">
                      <img
                        src={chat.user.avatar || "/avatar.png"}
                        alt="userimage"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="h-full w-[75%] flex flex-col justify-center gap-2 ">
                      <div className="flex items-center justify-between ">
                        <h3 className="text-2xl font-light capitalize">
                          {chat?.user.username}
                        </h3>
                        <p className="text-xs font-thin">{chat?.createdAt}</p>
                      </div>
                      <p className="text-xs font-thin overflow-hidden text-ellipsis whitespace-nowrap w-[2rem]">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;

const Button = ({ click, title }) => {
  return (
    <>
      <button
        onClick={click}
        className={`p-2  hover:bg-black/40 hover:backdrop-filter hover:backdrop-blur-lg rounded-lg w-full text-nowrap  text-left transition-all duration-150 ${
          title === "Delete Account"
            ? "text-red-600"
            : title === "Logout"
            ? "text-[#22ffff]"
            : ""
        }`}
      >
        {title}
      </button>
    </>
  );
};
