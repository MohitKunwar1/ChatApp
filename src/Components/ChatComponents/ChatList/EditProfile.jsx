import React, { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import UserList from "./UserList";
import { useUserStore } from "../../../lib/userStore";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import upload from "../../../lib/upload";

const EditProfile = () => {
  const [showProfile, setShowProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUserStore();
  const [username, setUsername] = useState(currentUser.username);
  const [about, setAbout] = useState(currentUser.about || "");
  const [avatar, setAvatar] = useState({
    file: null,
    url:  "",
  });

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setAbout(currentUser.about || "");
      setAvatar({
        file: null,
        url: currentUser.avatar || "",
      });
    }
  }, [currentUser]);


  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleShowProfile = () => {
    setShowProfile(false);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imgUrl = currentUser.avatar;
      if (avatar.file) {
        imgUrl = await upload(avatar.file);
      }

      const docRef = doc(db, "users", currentUser?.id);
      await updateDoc(docRef, {
        about,
        username,
        avatar: imgUrl || currentUser.avatar,
        id: currentUser?.id,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showProfile ? (
        <div className="addUser h-full flex-1  text-white">
          <div className="p-[1rem]  flex items-center gap-10">
            <button onClick={handleShowProfile}>
              <GoArrowLeft className="text-2xl cursor-pointer hover:bg-black/60 hover:p-1 rounded-full duration-150" />
            </button>
            <p className="text-xl font-light">Edit Profile</p>
          </div>
          <form
            onSubmit={handleEditProfile}
            className="flex flex-col gap-3 p-[3rem]"
          >
            <div className="w-full flex flex-col items-center mb-[2rem]">
              <label
              
                htmlFor="image"
                className={`cursor-pointer underline text-sm font-light ${loading && "text-gray-500"} `}
              >
                <img
                
                  src={
                    avatar.url
                      ? avatar.url
                      : currentUser.avatar
                      ? currentUser.avatar
                      : "/avatar.png"
                  }
                  alt="userimage"
                  className={`w-[5rem] h-[5rem] rounded-full object-cover ${loading && "bg-black/50 backdrop-filter backdrop-blur-lg z-10"}`} 
                />
                Upload Image
              </label>
              <input
                type="file"
                onChange={handleAvatar}
                name="image"
                id="image"
                readOnly={loading}
                className="hidden"
              />
            </div>
            <label htmlFor="text" className="text-xl ">
              Enter Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="text"
              id="text"
              placeholder="Username..."
              readOnly={loading}
              className={`p-2 rounded-md bg-black/50 outline-none capitalize ${loading && "read-only:text-gray-500"}`}
            />
            <label htmlFor="about" className="text-xl ">
              About User:
            </label>
            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              name="about"
              id="about"
              placeholder="About user..."
              readOnly={loading}
              className={`p-2 rounded-md bg-black/50 outline-none capitalize ${loading && "read-only:text-gray-500" }`}
            />
            <button
              disabled={loading}
              className={`px-3 py-2 mt-2 rounded-lg  text-lg hover:shadow-lg duration-150 ${
                loading ? "bg-sky-700/50 cursor-not-allowed" : "bg-sky-900"
              }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      ) : (
        <UserList />
      )}
    </>
  );
};

export default EditProfile;
