import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../lib/firebaseConfig";


const Login = () => {
  const [loading, setLoading] = useState(false);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toast.error("User does not exist. Please check your credentials.");
      } else if (
        error.code === "auth/invalid-email" ||
        "auth/missing-password"
      ) {
        toast.error("All field are requierd!");
      } else {
        toast.error(error.code);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <div className="login w-[50%] flex flex-col items-center m-3 sm:m-0 sm:gap-20 text-white  ">
      <h1 className="sm:text-[3rem] text-2xl mb-3 sm:mb-0">Login</h1>
      <p className="text-gray-300">for test you can use "bret@gmail.com" and password is "123456"</p>
      <form onSubmit={handleLogin} className="flex flex-col sm:gap-3 ">
        <label htmlFor="email" className="sm:text-xl ">
          Enter Email:
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email..."
          readOnly={loading}
          className={`outline-none bg-transparent border-b-[1px] mb-[1rem] w-64 ${loading && "text-gray-500"}`}
        />
        <label htmlFor="password" className="sm:text-xl ">
          Enter Password:
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password..."
          readOnly={loading}
          className={`outline-none bg-transparent border-b-[1px] mb-[1rem] ${loading && "text-gray-500"}`}
        />
        <button
          disabled={loading}
          className={`sm:px-5 py-2 rounded-lg bg-green-900 sm:text-lg hover:shadow-lg duration-150 ${
            loading ? "bg-green-900/50" : "bg-green-900"
          }`}
        >
          {loading ? "LoggingIn..." : "Login"}
        </button>
      </form>
    </div>
    </>
  );
};

export default Login;
