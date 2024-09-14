import React, { useState } from "react";
import toast from "react-hot-toast";
import { auth, db } from "../../lib/firebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import upload from "../../lib/upload.js";

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    if (!username || !avatar.file) {
      toast.error("Username and avatar are required!");
      setLoading(false);
      return;
    }
  
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        about: "",
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created successfuly! You can login now.");
    } catch (error) {
      if (error.code == "auth/email-already-in-use") {
        toast.error("Email-already-in-use");
      } else if (
        error.code === "auth/invalid-email" ||
        "auth/missing-password"
      ) {
        toast.error("All fields are required!");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup w-[50%] flex flex-col items-center justify-center m-5 sm:m-0 sm:gap-10 text-white ">
      <h1 className="sm:text-[2.5rem] text-xl">Create An Account</h1>
      <form onSubmit={handleSignUp} className="flex flex-col gap-2">
        <div className="w-full flex flex-col items-center  sm:mb-[2rem]">
          <label
            htmlFor="image"
            className="cursor-pointer underline text-sm sm:text-sm font-extralight sm:font-light"
          >
            <img
              src={avatar.url || "/avatar.png"}
              alt="userimage"
              className="sm:w-[5rem] sm:h-[5rem] w-[3rem] h-[3rem] rounded-full object-cover mx-auto"
            />
            Upload Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleAvatar}
            className="hidden"
          />
        </div>
        <label htmlFor="username" className="sm:text-xl ">
          Enter Username:
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username..."
          className="capitalize outline-none bg-transparent border-b-[1px] mb-[1rem] w-64"
        />
        <label htmlFor="email" className="sm:text-xl ">
          Enter Email:
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email..."
          className="outline-none bg-transparent border-b-[1px] mb-[1rem]"
        />

        <label htmlFor="password" className="sm:text-xl ">
          Enter Password:
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password..."
          className="outline-none bg-transparent border-b-[1px] mb-[1rem]"
        />
        <button
          disabled={loading}
          className={`sm:px-3  py-2  mt-2 rounded-lg  sm:text-lg hover:shadow-lg duration-150 ${
            loading ? "bg-red-900/50 cursor-not-allowed" : "bg-red-900"
          }`}
        >
          {loading ? "Creating..." : "SignUp"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
