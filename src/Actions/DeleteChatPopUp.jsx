import React from "react";
import toast from "react-hot-toast";
import {  doc, getDoc, updateDoc } from "firebase/firestore";
import { useUserStore } from "../lib/userStore.js";
import { useChatStore } from "../lib/chatStore.js";
import { db } from "../lib/firebaseConfig.js";
import { useModal } from "../ContextProvider/ModalContext.jsx";
const DeleteChatPopUp = () => {
  const {currentUser} = useUserStore();
  const {chatId, resetChatId} = useChatStore();
  const {handleModalClose} = useModal();

  const handleDeleteChat = async () => {
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
  
      if (chatDoc.exists()) {
        const messages = chatDoc.data().messages || [];
  
        const updatedMessages = messages.map((msg) => {
          if (!msg.clearedChat.includes(currentUser?.id)) {
            return {
              ...msg,
              clearedChat: [...msg.clearedChat, currentUser?.id],
            };
          }
          return msg;
        });
  
        await updateDoc(chatRef, {
          messages: updatedMessages,
        });
  
        // Remove the chat reference from the user's chat list
        const userChatRef = doc(db, "userchats", currentUser.id);
        const userChatsSnapshot = await getDoc(userChatRef);
  
        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
          const updatedChats = userChatData.chats.filter(
            (chat) => chat.chatId !== chatId
          );
  
          await updateDoc(userChatRef, {
            chats: updatedChats,
          });
        }
        handleModalClose();
        resetChatId();
        toast.success("Chat deleted!");
        
      } else {
        console.log("No such document!");
        toast.error("Chat not found.");
      }
    } catch (error) {
      console.log("Error deleting chat:", error);
      toast.error("Failed to delete chat.");
    }
  };
  

  return (
    <div className="w-[30rem] h-[15rem] bg-neutral-800 p-6 text-gray-300 rounded-lg flex flex-col  justify-center gap-10 shadow-xl absolute z-50  ">
      <h4 className="text-start text-2xl font-normal">Delete this chat?</h4>
      <div>
        <p className="text-lg font-light">
          This chat will be Delete. Are you sure you want to delete this chat?
        </p>
      </div>
      <div className="text-end ">
        <button
          onClick={handleModalClose}
          className=" font-medium px-6 py-2 rounded-full border-[1px] border-green-500/60 text-green-500/60 mr-5 hover:border-green-500 hover:text-green-500 hover:shadow-lg duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteChat}
          className="font-medium px-6 py-2 rounded-full bg-green-400/60 text-green-950 hover:bg-green-500 hover:shadow-lg duration-200"
        >
          Delete Chat
        </button>
      </div>
    </div>
  );
};

export default DeleteChatPopUp;
