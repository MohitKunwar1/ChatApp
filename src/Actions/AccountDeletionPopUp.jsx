import React, { useState } from "react";
import { useUserStore } from "../lib/userStore";
import toast from "react-hot-toast";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { deleteUser, reauthenticateWithCredential } from "firebase/auth";
import { auth, db } from "../lib/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { useModal } from "../ContextProvider/ModalContext";

const AccountDeletionPopUp = () => {
  const { currentUser } = useUserStore();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {handleModalClose} = useModal()

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("No user is currently signed in.");
      return;
    }

    if (!password) {
      toast.error("Password is required to delete the account.");
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Delete user data from Firestore
      await deleteDoc(doc(db, "users", currentUser?.id));
      await deleteDoc(doc(db, "userchats", currentUser?.id));

      // Delete user authentication record
      await deleteUser(auth.currentUser);

      toast.success("Account deleted successfully!");
      handleModalClose();
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("Please log in again and try deleting your account.");
      } else {
        toast.error("Failed to delete account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[35rem] h-[20rem] bg-neutral-800 p-8 text-gray-300 rounded-lg flex flex-col  justify-center gap-10 shadow-xl absolute z-50  ">
      <h4 className="text-start text-2xl font-normal">Delete Account</h4>
      <div>
        <p className="text-lg font-light">
          Are You sure you want to Delete Account?
        </p>
      </div>
      <form onSubmit={handleDeleteAccount} className="flex flex-col gap-5">
        <label htmlFor="password" className="text-start text-base font-normal">
          Enter Password To Delete Account :
        </label>
        <input
          type="password"
          placeholder="Password........."
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`outline-none  px-2  rounded-md border-2 border-green-500/60 bg-transparent focus:border-green-500 transition-all duration-200 ${
            loading ? "cursor-not-allowed" : "cursor-text"
          }`}
        />
        <div className="text-end ">
          <button
            disabled={loading}
            onClick={handleModalClose}
            className={` font-medium px-6 py-2 rounded-full border-[1px]  duration-200 ${
              loading
                ? "cursor-not-allowed border-green-500/50 text-green-500/50"
                : "cursor-pointer border-green-500/60 text-green-500/60 mr-5 hover:border-green-500 hover:text-green-500 hover:shadow-lg"
            }`}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className={`font-medium px-6 py-2 rounded-full duration-200 ${
              loading
                ? "cursor-not-allowed bg-red-950/50 text-red-950/50"
                : "cursor-pointer bg-red-500/60 text-red-950 hover:bg-red-500 hover:shadow-lg"
            }`}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDeletionPopUp;
