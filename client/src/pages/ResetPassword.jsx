import { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, getUserData, userData, setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPasword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  
  const sendResetOtp = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`${backendUrl}/auth/send-reset-otp`,{email});
      if (data.success) {
        toast.success(data.message);
       setIsEmailSent(true)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const onSubmitOtp = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e)=>e.value)
      setOtp(otpArray.join(''))
       setIsOtpSubmited(true)
       toast.success(success.message)
    } catch (error) {
      setIsLoggedin(false)
    }
  };
  const onSubmitNewPassword = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`${backendUrl}/auth/reset-password`,{email,otp,newPassword});
      if (data.success) {
        toast.success(data.message);
        navigate('/login')
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoggedin(false)
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
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 top-5 sm:left-20 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt="Home"
      />
      {/*  */}

      {!isEmailSent &&
      
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <form
          onSubmit={sendResetOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-center p-6 bg-slate-900 rounded-lg shadow-lg  text-lg">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your Register Email Id
          </p>
          <div className="mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img className="w-3" src={assets.mail_icon} alt="" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-white bg-transparent outline-none"
              type="email"
              placeholder="Email Id"
            />
          </div>
          <button
            className=" flex flex-col w-full justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-gray-800 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
}
      {/*  */}

      {!isOtpSubmited && isEmailSent &&
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          action=""
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-3">
            Reset Password OTP
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
            Submit
          </button>
        </form>
      </div>
}
      {/*  */}

      {isOtpSubmited && isEmailSent &&
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          action=""
        >
          <h1 className="text-white text-center p-4 bg-slate-900 rounded-lg shadow-lg  text-2xl font-bold">
            New Password
          </h1>
          <p className="text-center  mb-6 text-indigo-300">
            Enter your New Password
          </p>
          <div className="mb-6 flex items-center gap-5 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img className="w-2.5" src={assets.lock_icon} alt="" />
            <input
              value={newPassword}
              onChange={(e) => setNewPasword(e.target.value)}
              required
              className="text-white bg-transparent outline-none"
              type="text"
              placeholder="Password"
            />
          </div>
          <button
            className=" flex flex-col w-full justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-gray-800 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
}
    </div>
  );
};

export default ResetPassword;
