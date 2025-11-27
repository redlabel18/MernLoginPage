import { useContext } from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl, setIsLoggedin,getUserData } = useContext(AppContent);
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign up") {
        const { data } = await axios.post(`${backendUrl}/auth/api/register`, {
          name,
          email,
          password,
        });
        if (data.success) {
          setIsLoggedin(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/auth/api/login`, {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedin(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigate = useNavigate();
  const [state, setState] = useState("Sign up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 top-5 sm:left-20 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      {/* <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400"></div> */}
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src={assets.header_img}
            alt="Your Company"
            class="mx-auto h-30 w-auto object-contain mix-blend-multiply"
          />
          <h2 class=" text-center text-3xl/9 font-semibold tracking-tight text-gray-600">
            {state === "Sign up"
              ? "Create new Account"
              : "Login to your Account"}
          </h2>
        </div>

        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
          <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm" onSubmit={onSubmitHandler} class="space-y-6">
            {state === "Sign up" && (
              <div>
                <label
                  class="block text-sm/6 font-medium text-gray-800"
                >
                  Name
                </label>
                <div class="mt-2">
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    id="name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-800 outline-1 -outline-offset-1 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  />
                </div>
              </div>
            )}
            <div>
              <label
                for="email"
                class="block text-sm/6 font-medium text-gray-800"
              >
                Email address
              </label>
              <div class="mt-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-800 outline-1 -outline-offset-1 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="block text-sm/6 font-medium text-gray-800"
                >
                  Password
                </label>
              </div>
              <div class="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-800 outline-1 -outline-offset-1  placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
                {state === "Login" && (
                  <div class="text-sm text-end">
                    <a
                      onClick={() => navigate("/reset-password")}
                      class="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-gray-800 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {state}
              </button>
            </div>
          </form>

          {state === "Sign up" ? (
            <p class="mt-5 text-center text-sm/6 text-gray-600">
              Already have an Account?{"  "}
              <a
                onClick={() => setState("Login")}
                href="#"
                class="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Login here
              </a>
            </p>
          ) : (
            <p class="mt-5 text-center text-sm/6 text-gray-600">
              Don't have an Account?{"  "}
              <a
                onClick={() => setState("Sign up")}
                href="#"
                class="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Sign up here
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
