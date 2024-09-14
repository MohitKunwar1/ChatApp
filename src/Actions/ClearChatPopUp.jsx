import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { db } from "../lib/firebaseConfig";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStore";
import toast from "react-hot-toast";
import { useModal } from "../ContextProvider/ModalContext";

const ClearChatPopUp = () => {
  const { chatId } = useChatStore();
  const { currentUser } = useUserStore();
  const { handleModalClose } = useModal();

  //Function to clear chats of the current user
  const handleClearChat = async () => {
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

      // Clear the last message in the user list component
      const userIds = [currentUser.id];
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();

          const chatIndex = userChatData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          if (chatIndex !== -1) {
            userChatData.chats[chatIndex].lastMessage = "";
            userChatData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatRef, {
              chats: userChatData.chats,
            });
          }
        }
      });

      handleModalClose();
      toast.success("Chat cleared!");
    } else {
      console.log("No such document!");
      toast.error("Chat not found.");
    }
  } catch (error) {
    console.log("Error clearing messages:", error);
    toast.error("Failed to clear messages.");
  }
};


  return (
    <div className="w-[30rem] h-[15rem] bg-neutral-800 p-6 text-gray-300 rounded-lg flex flex-col  justify-center gap-10 shadow-xl absolute z-50  ">
      <h4 className="text-start text-2xl font-normal">Clear this chat?</h4>
      <div>
        <p className="text-lg font-light">
          This chat will be empty. Are you sure you want to clear this chat?
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
          onClick={handleClearChat}
          className="font-medium px-6 py-2 rounded-full bg-green-400/60 text-green-950 hover:bg-green-500 hover:shadow-lg duration-200"
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
};

export default ClearChatPopUp;
