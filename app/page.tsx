"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [dateTime, setDateTime] = useState(new Date());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [password, setPassword] = useState(""); 
  const router = useRouter();

  const correctPassword = "dubuntu";

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval); // Cleanup interval
  }, []);

  const handleLogin = () => {
    if (password === correctPassword) {
      router.replace("/terminal"); // Ganti router.push() dengan router.replace()
    } else {
      alert("Incorrect password. Please try again.");
    }
  };
  

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/walpeper.png')" }}>
      {/* Real-Time Date & Time */}
      <div className="absolute top-4 text-white text-lg font-medium">
        {dateTime.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        {dateTime.toLocaleTimeString("en-US")}
      </div>

      {/* Login Card */}
      <div className="flex flex-col items-center space-y-6 bg-black/65 p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md md:max-w-md">
        {/* User Avatar */}
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
          <img
            src="/images.png" 
            alt="User Avatar"
            className="w-24 h-24 rounded-full"
          />
        </div>

        {/* Username */}
        <div className="text-white text-2xl font-semibold">CipherChain OS</div>

        {/* Password Input */}
        <div className="w-full">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md outline-none border-2 border-transparent focus:border-purple-400 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          className="w-full px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-all"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>

      {/* Settings Icon */}
      <div
        className="absolute bottom-4 right-4 cursor-pointer"
        onClick={() => setIsPopupOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-8 h-8 hover:opacity-80 transition-opacity"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 2.25a1.5 1.5 0 011.5 0l.867.5a1.5 1.5 0 01.616.616l.5.867a1.5 1.5 0 010 1.5l-.5.867a1.5 1.5 0 01-.616.616l-.867.5a1.5 1.5 0 01-1.5 0l-.867-.5a1.5 1.5 0 01-.616-.616l-.5-.867a1.5 1.5 0 010-1.5l.5-.867a1.5 1.5 0 01.616-.616l.867-.5zM11.25 14.25v2.25m-4.5 1.5h9m-2.25-8.25v6"
          />
        </svg>
      </div>

      {/* Developer Info */}
      <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
        Developer: Aliza Nurfitrian M
      </div>

      {/* Password Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-6 rounded-lg space-y-4 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="text-xl font-semibold">Password Information</div>
            <p>The password to log in is <b>"{correctPassword}"</b>.</p>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="w-full px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
