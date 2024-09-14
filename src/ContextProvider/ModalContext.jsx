import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(false);

  const [clearChatActive, setClearChatActive] = useState(false);
  const [logoutActive, setLogoutActive] = useState(false);
  const [deleteAccountActive, setDeleteAccountActive] = useState(false);
  const [deleteChatActive, setDeleteChatActive] = useState(false);

  const handleModalClose = () => {
    setModal(false);
    setDeleteChatActive(false);
    setLogoutActive(false);
    setDeleteAccountActive(false);
  };

  return (
    <ModalContext.Provider
      value={{
        modal,
        setModal,
        clearChatActive,
        setClearChatActive,
        logoutActive,
        setLogoutActive,
        deleteAccountActive,
        setDeleteAccountActive,
        handleModalClose,
        deleteChatActive,
        setDeleteChatActive,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
