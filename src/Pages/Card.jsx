import React, { useEffect, useState } from "react";
import UserList from "../Components/ChatComponents/ChatList/UserList";
import Register from "./Register";
import Notification from "../notification/Notification.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebaseConfig.js";
import { useUserStore } from "../lib/userStore.js";
import Loading from "../utils/Loading.jsx";
import { useChatStore } from "../lib/chatStore.js";
import ChatModal from "../Components/ChatComponents/ChatRoom/ChatModal.jsx";
import ChatRoom from "../Components/ChatComponents/ChatRoom/ChatRoom.jsx";
import Modal from "../Modal/Modal.jsx";
import ClearChatPopUp from "../Actions/ClearChatPopUp.jsx";
import DeleteChatPopUp from "../Actions/DeleteChatPopUp.jsx";
import LogoutPopUp from "../Actions/LogoutPopUp.jsx";
import AccountDeletionPopUp from "../Actions/AccountDeletionPopUp.jsx";
import { useModal } from "../ContextProvider/ModalContext.jsx";

const Card = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  const {
    modal,
    setModal,
    clearChatActive,
    setClearChatActive,
    logoutActive,
    setLogoutActive,
    setDeleteAccountActive,
    deleteAccountActive,
    handleModalClose,
    deleteChatActive,
    setDeleteChatActive,
  } = useModal();

  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <>
      <div className="size relative flex rounded-lg overflow-hidden bg-black/20 backdrop-filter backdrop-blur-lg shadow-lg ">
        {currentUser ? (
          <>
            <UserList />
            {chatId ? <ChatRoom /> : <ChatModal />}
            <Modal>
              {deleteChatActive ? (
                <DeleteChatPopUp />
              ) : logoutActive ? (
                <LogoutPopUp />
              ) : deleteAccountActive ? (
                <AccountDeletionPopUp />
              ) : clearChatActive ? (
                <ClearChatPopUp />
              ) : (
                ""
              )}
            </Modal>
          </>
        ) : (
          <Register />
        )}
        <Notification />
      </div>
    </>
  );
};

export default Card;
