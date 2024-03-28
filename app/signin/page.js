"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiURL } from "@/config";
import { useGoogleLogin } from "@react-oauth/google";
import InputField from "../ui/InputField";
import passwordValidator from "password-validator";

import Image from "next/image";
import eyeIcon from "../../public/svg/eye.svg";
import eyeSlashIcon from "../../public/svg/eyecross.svg";

// Reusable Button Component
const SignInButton = ({
  imageUrl,
  altText,
  buttonText,
  extraClasses = "",
  onClick = () => {},
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
  const [user, setUser] = useState([]);

  const googleLoginRef = useRef(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) =>
      NotificationManager.warning(
        "Login with Google failed! " + error,
        "Warning"
      ),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log("user data: ", res.data);
          axios
            .post(`${apiURL}/auth/google_login`, res.data, {
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
                localStorage.setItem("fullname", response.data.name);
                router.push("/");
              }
            })
            .catch((error) => {
              NotificationManager.error(error, "Error");
            });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

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
      extraClasses: "bg-white text-gray-500 gap-1 text-[20px]",
      onClick: toggleEmailSignIn,
    },
    {
      imageUrl: "svg/google.svg",
      altText: "Sign in with Google Icon",
      buttonText: "Sign in with Google",
      extraClasses: "bg-white text-gray-500 gap-1 text-[20px]",
      onClick: () => login(),
    },
    {
      imageUrl: "svg/apple.svg",
      altText: "Sign in with Apple Icon",
      buttonText: "Sign in with Apple",
      extraClasses: "bg-black text-white gap-1 text-[20px]",
      onClick: () => alert("Sign in with Apple clicked"),
    },
    {
      imageUrl: "svg/facebook.svg",
      altText: "Sign in with Facebook Icon",
      buttonText: "Sign in with Facebook",
      extraClasses: "bg-[#1877F2] text-white gap-1 text-[20px]",
      onClick: () => alert("Sign in with Facebook clicked"),
    },
  ];

  return (
    <div className="h-screen overflow-auto bg-[length:1920px_1024px] bg-[url('/background.jpg')] flex flex-col items-center justify-center">
      {" "}
      {showSignInOptions && (
        <div className="flex items-center justify-center min-h-screen">
          <section className="flex flex-col items-center px-7 pt-4 pb-6 text-xl font-medium text-white rounded-[10px] bg-[#2D2D2D] min-w-[400px]">
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
                className="text-center mt-3 cursor-pointer text-white "
                onClick={() => router.push("/register")}
              >
                <span style={{ fontSize: "15px" }}>
                &quot;Don&apos;t have an account? Register&quot;
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const schema = new passwordValidator();

  // Add properties to it
  schema
    .is()
    .min(8) // Minimum length 8
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .symbols();

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
          localStorage.setItem("fullname", response.data.name);
          localStorage.setItem("email", response.data.email);
          router.push("/");
        }
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  const validateForm = () => {
    if (email == "") {
      NotificationManager.error("Email is required.", "Error", 2000);
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      NotificationManager.error("Invalid Email.", "Error", 2000);
      return false;
    }

    if (password === "") {
      NotificationManager.error("Password is required.", "Error", 2000);
      return false;
    }
    // else
    // if (!schema.validate(password)) {
    //   errors.password =
    //     "Password must contain at least 8 characters including uppercase letters, lowercase letters, special characters, and digits. For example: MyP@ssw0rd, 123$Secure, StrongPass#99";
    // }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const logData = { email, password }; // If it's a username

      SignIn(logData);
    }
  };

  const [showPassword1, setShowPassword1] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword1(!showPassword1);
  };

  return (
    <form
      className="flex flex-col px-6 pt-6 pb-9 text-base font-medium text-white rounded-[10px] bg-[#2D2D2D] min-w-[400px]"
      onSubmit={handleSubmit}
    >
      <header className="flex flex-col max-w-full text-5xl text-center">
        <img
          loading="lazy"
          src="svg/close.svg"
          className="self-end aspect-square w-[18px]"
          onClick={onClose}
          alt=""
        />
        <h1 className="mt-1.5 font-nasalization">Sign in</h1>
      </header>
      <div className="flex flex-col mt-5">
        <label htmlFor="email" className="sr-only">
          E-mail
        </label>
        <InputField
          label="E-mail"
          type="email"
          name="email"
          required
          placeholder="Email or Username"
          aria-label="Email or Username"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col mt-0">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <InputField
            label="Password"
            type={showPassword1 ? "text" : "password"}
            name="password"
            required
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            <div>
              {showPassword1 ? (
                <Image
                  alt="Hide password"
                  width={20}
                  height={20}
                  src={eyeSlashIcon}
                  className="cursor-pointer mt-[26px]"
                />
              ) : (
                <Image
                  alt="Show password"
                  width={20}
                  height={20}
                  src={eyeIcon}
                  className="cursor-pointer mt-[26px]"
                />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* <div className="flex flex-col mt-0">
        <label htmlFor="password" className="sr-only">
          Password
        </label>

        <InputField
          label="Password"
          type="password"
          name="password"
          required
          placeholder="Password"
          aria-label="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div> */}

      <div className="flex flex-col mt-5">
        <button
          type="submit"
          className="px-16 py-2 whitespace-nowrap rounded-xl gr-1 hover:bg-blue-700 text-white"
        >
          Sign in
        </button>
      </div>
      <NotificationContainer />
    </form>
  );
}