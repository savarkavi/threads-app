/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "@/context/auth-provider";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";

type FormData = {
  fullname: string;
  username: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const [inputs, setInputs] = useState<FormData>({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { fullname, username, email, password } = inputs;

    if (!fullname || !username || !email || !password) {
      return toast.error("Invalid input fields");
    }

    try {
      await axios.post("/api/auth/signup", inputs);
      setInputs({
        fullname: "",
        username: "",
        email: "",
        password: "",
      });

      toast.success("Account successfully created.");
      navigate("/auth/signin");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-20">
      <h1 className="text-3xl sm:text-4xl font-semibold">Sign Up</h1>
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
        <div className="w-full flex flex-col gap-6 flex-[50%] p-4">
          <div className="flex flex-col gap-3">
            <label htmlFor="fullname">
              <h2 className="text-xl">Full Name</h2>
            </label>
            <input
              id="fullname"
              className="border border-white bg-white dark:bg-transparent rounded-lg p-3 w-full"
              value={inputs.fullname}
              onChange={(e) =>
                setInputs({ ...inputs, fullname: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="username">
              <h2 className="text-xl">Username</h2>
            </label>
            <input
              id="username"
              className="border border-white bg-white dark:bg-transparent rounded-lg p-3 w-full"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="email">
              <h2 className="text-xl">Email</h2>
            </label>
            <input
              id="email"
              type="email"
              className="border border-white bg-white dark:bg-transparent rounded-lg p-3 w-full"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
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

          <button className="p-3 rounded-lg bg-blue-500 mt-4">Sign Up</button>
          <div className="mt-4 flex gap-2 self-center">
            <p>Already a user?</p>
            <Link to="/auth/signin" className="text-blue-500">
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
