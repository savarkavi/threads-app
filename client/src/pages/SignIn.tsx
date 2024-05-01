/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "@/context/auth-provider";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";

type FormData = {
  username: string;
  password: string;
};

const SignIn = () => {
  const [inputs, setInputs] = useState<FormData>({
    username: "",
    password: "",
  });

  const { currentUser, setCurrentUser } = useAuthContext();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = inputs;

    if (!username || !password) {
      return toast.error("Invalid input fields");
    }

    try {
      const { data } = await axios.post("/api/auth/signin", inputs);
      setInputs({
        username: "",
        password: "",
      });
      toast.success(`Welcome ${data.fullname}`);
      localStorage.setItem("currentUser", JSON.stringify(data));

      setCurrentUser(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-20">
      <h1 className="text-3xl sm:text-4xl font-semibold">Sign In</h1>
      <form
        className="bg-gray-200 dark:bg-zinc-900 shadow-2xl rounded-xl w-full mx-auto flex"
        onSubmit={handleFormSubmission}
      >
        <div className="w-full flex-[50%] hidden sm:block">
          <img
            src="/giphy.gif"
            className="object-cover w-full h-full rounded-l-xl"
          />
        </div>
        <div className="w-full flex flex-col gap-10 flex-[50%] p-4">
          <div className="flex flex-col gap-3">
            <label htmlFor="username">
              <h2 className="text-xl">Username</h2>
            </label>
            <input
              id="username"
              className="border border-white text-black dark:text-white bg-white dark:bg-transparent rounded-lg p-3 w-full"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="password">
              <h2 className="text-xl">Password</h2>
            </label>
            <input
              id="password"
              type="password"
              className="border border-white bg-white dark:bg-transparent rounded-lg p-3 w-full"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>

          <button className="p-3 rounded-lg bg-blue-500 mt-4">Sign In</button>
          <div className="mt-4 flex gap-2 self-center">
            <p>New user?</p>
            <Link to="/auth/signup" className="text-blue-500">
              SignUp
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
