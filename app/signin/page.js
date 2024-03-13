"use client";
import React, { useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiURL } from "@/config";

// Reusable Button Component
const SignInButton = ({
  imageUrl,
  altText,
  buttonText,
  extraClasses,
  onClick,
}) => (
  <button
    className={`flex items-center justify-between px-4 py-3 w-full rounded-xl shadow ${extraClasses}`}
    onClick={onClick}
  >
    <img src={imageUrl} alt={altText} className="w-6 h-6  mr-2" />
    <span className="flex-auto text-left">{buttonText}</span>
  </button>
);

// Main Component
const SignInOptions = () => {
  const router = useRouter();
  const [showEmailSignIn, setShowEmailSignIn] = useState(false);
  const [showSignInOptions, setShowSignInOptions] = useState(true);

  const toggleEmailSignIn = () => {
    setShowEmailSignIn((prev) => !prev);
    setShowSignInOptions(false);
  };

  const toggleSignInOptions = () => {
    setShowEmailSignIn(false);
    setShowSignInOptions(true);
  };

  const buttonsData = [
    {
      imageUrl: "svg/email.svg",
      altText: "Sign in with Email Icon",
      buttonText: "Sign in with Email",
      extraClasses: "bg-white text-gray-500",
      onClick: toggleEmailSignIn,
    },
    {
      imageUrl: "svg/google.svg",
      altText: "Sign in with Google Icon",
      buttonText: "Sign in with Google",
      extraClasses: "bg-white text-gray-500",
      onClick: () => alert("Sign in with Google clicked"),
    },
    {
      imageUrl: "svg/apple.svg",
      altText: "Sign in with Apple Icon",
      buttonText: "Sign in with Apple",
      extraClasses: "bg-black text-white",
      onClick: () => alert("Sign in with Apple clicked"),
    },
    {
      imageUrl: "svg/facebook.svg",
      altText: "Sign in with Facebook Icon",
      buttonText: "Sign in with Facebook",
      extraClasses: "bg-blue-600 text-white",
      onClick: () => alert("Sign in with Facebook clicked"),
    },
  ];

  return (
    <div className="h-screen overflow-auto bg-[length:1920px_1024px] bg-[url('/background.jpg')] flex flex-col items-center justify-center">
      {" "}
      {/* Updated */}
      {showSignInOptions && (
        <div className="flex items-center justify-center min-h-screen">
          <section className="flex flex-col items-center px-7 pt-4 pb-6 text-xl font-medium text-white rounded-xl bg-zinc-800 max-w-[400px]">
            <header className="flex justify-between w-full  mb-4"></header>
            <main className="w-full">
              {buttonsData.map((button, index) => (
                <React.Fragment key={index}>
                  <SignInButton
                    imageUrl={button.imageUrl}
                    altText={button.altText}
                    buttonText={button.buttonText}
                    extraClasses={button.extraClasses}
                    onClick={button.onClick}
                  />
                  {index !== buttonsData.length - 1 && <div className="h-4" />}
                </React.Fragment>
              ))}
              <div
                tabIndex="0"
                role="button"
                className="text-center mt-5 cursor-pointer text-white"
                onClick={() => router.push("/register")}
              >
                <span style={{ fontSize: "0.8rem" }}>
                  Don't have account? Register
                </span>
              </div>
            </main>
          </section>
        </div>
      )}
      {showEmailSignIn && <EmailSignInForm onClose={toggleSignInOptions} />}
    </div>
  );
};

export default SignInOptions;

function EmailSignInForm({ onClose }) {
  const router = useRouter();

  const SignIn = (logData) => {
    axios
      .post(`${apiURL}/auth/signin`, logData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 201) {
          NotificationManager.warning(response.data.message, "Warning");
        }
        if (response.status === 200) {
          NotificationManager.success(
            "Logged in successfully",
            "Success",
            2000
          );
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userID", response.data.user_id);
          localStorage.setItem("email", response.data.email);
          router.push("/");
        }
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const emailOrUsername = formData.get("email");
    const password = formData.get("password");

    // Check if the entered value is an email address or username
    const isEmail = emailOrUsername.includes("@");
    const logData = isEmail
      ? { email: emailOrUsername, password: password } // If it's an email
      : { username: emailOrUsername, password: password }; // If it's a username

    console.log("Form Data:", logData); // Log the data being sent to the server

    SignIn(logData);
  };

  return (
    <form
      className="flex flex-col px-6 pt-6 pb-9 text-base font-medium text-white rounded-xl bg-zinc-800 max-w-[400px]"
      onSubmit={handleSubmit}
    >
      <header className="flex flex-col self-end max-w-full text-5xl text-center w-[252px]">
        <img
          loading="lazy"
          src="svg/close.svg"
          className="self-end aspect-square w-[18px]"
          onClick={onClose}
          alt=""
        />
        <h1 className="mt-1.5 font-nasalization">Sign in</h1>
      </header>
      <div className="flex flex-col mt-10">
        <label htmlFor="email" className="sr-only">
          E-mail
        </label>
        <input
          type="text"
          id="email"
          name="email"
          required
          placeholder="Email or Username"
          className="mt-3 px-3 py-1.5 rounded-lg border border-white focus:outline-none focus:border-blue-500 text-white bg-transparent"
          aria-label="Email or Username"
        />
      </div>
      <div className="flex flex-col mt-5">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          placeholder="Password"
          className="mt-3 px-3 py-1.5 rounded-lg border border-white focus:outline-none focus:border-blue-500 text-white bg-transparent"
          aria-label="Password"
        />
      </div>
      <div className="flex justify-center items-center">
        <button
          type="submit"
          className="px-16 py-2.5 mt-7 whitespace-nowrap rounded-xl bg-blue-500 hover:bg-blue-700 text-white"
        >
          Sign in
        </button>
      </div>
      <NotificationContainer />
    </form>
  );
}
