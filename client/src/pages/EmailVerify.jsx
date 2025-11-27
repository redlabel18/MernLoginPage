import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, userData, getUserData, isLoggedin, } =
    useContext(AppContent);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const otp = otpArray.join("");
    const { data } = await axios.post(`${backendUrl}/auth/verify-email`, {
      otp,
    });
    if (data.success) {
      toast.success(data.message);
      getUserData();
      navigate("/");
    } else {
      toast.error(data.message);
    }
    } catch (error) {
      toast.error(error.message)
    }
  };
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };
  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedin, userData])
  console.log(userData.isAccountVerified)
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 top-5 sm:left-20 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <form
          onSubmit={onSubmitHandler}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          action=""
        >
          
          <h1 className="text-white text-2xl font-semibold text-center mb-3">
            Email Verify OTP
          </h1>
          <p className="text-center mb-5 text-indigo-300">
            Enter the 6 Digit code sent to your Email.
          </p>
          <div
            className="flex justify-between mb-7"
            onPaste={(e) => handlePaste(e)}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md "
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button
            className=" flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-gray-800 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            type="submit"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
