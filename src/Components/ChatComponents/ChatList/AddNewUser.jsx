import React, { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import UserList from "./UserList";
import toast from "react-hot-toast";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import { useUserStore } from "../../../lib/userStore";

const AddNewUser = () => {
  const { currentUser } = useUserStore();
  const [openNewUser, setOpenNewUser] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)
  
  const handlenewUserBlock = () => {
    setOpenNewUser(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    setLoading(true)
    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }finally{
      setLoading(false)
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

     
    setLoading(true)
    try {
      
       //Fetch current user's from the chatList
       const currentUserChatDoc = await getDoc(doc(userChatRef, currentUser?.id));
       const currentUserChats = currentUserChatDoc.exists() ? currentUserChatDoc.data().chats : [];
   
       //check if the user already exists in userlist
       const userExists = currentUserChats?.some(chat => chat.receiverId === user.id);
   
       if(userExists){
         toast.error("User Already Exists!");
         setLoading(false);
         return;
       }

       
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
      setOpenNewUser(false);
      toast.success("User Added!");
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      {openNewUser ? (
        <div className="addUser w-full h-full  text-white">
          <div className="p-[1rem]  flex items-center gap-10">
            <button onClick={handlenewUserBlock} className={`${loading ? "cursor-not-allowed " : " cursor-pointer"} `}>
              <GoArrowLeft className="text-2xl cursor-pointer hover:bg-black/60 hover:p-1 rounded-full duration-150" />
            </button>
            <p className="text-xl font-light">New Chat</p>
          </div>
          <form onSubmit={handleSearch}>
            <div className=" searchchat  h-[2.5rem]  flex  justify-center items-center gap-3 my-4 ">
              <div className=" w-[75%] h-full flex items-center justify-center p-2 gap-2 rounded-md overflow-hidden text-center bg-black/60 ">
                <IoSearch className="text-xl  " />
                <input
                  type="text"
                  name="username"
                  placeholder="Search..."
                  className={`w-full bg-transparent outline-none border-none capitalize cursor-not-allowed ${loading ? "cursor-not-allowed " : "cursor-text"}`}
                />
              </div>
              <button className={`text-sm bg-blue-600 hover:bg-blue-700/70 duration-150  px-3 py-2 rounded-md ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                Search
              </button>
            </div>
          </form>
          <div className="userslist h-full overflow-y-scroll scroll-smooth no-scrollbar border-t-[1px] border-gray-400  ">
            {user ? (
              <div
                key={user}
                onClick={handleAdd}
                className={`p-3 flex  items-center  gap-5 cursor-pointer hover:bg-black/30 duration-150 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <img
                  src={user.avatar || "/avatar.png"}
                  alt="userimage"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="flex flex-col items-start">
                  <h3 className="text-2xl capitalize">{user.username}</h3>
                  <p className="text-sm font-light">{user.about}</p>
                </div>
              </div>
            ) : (
              <div className=" pt-[3rem] text-center">
                <p className=" text-gray-500 text-2xl font-thin">
                  Add new user...
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <UserList />
      )}
    </>
  );
};

export default AddNewUser;
