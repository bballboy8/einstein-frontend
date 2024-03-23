"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import InputField from "../ui/InputField";
import { apiURL } from "@/config";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import passwordValidator from "password-validator";

// Reusable Button Component
const RegisterButton = ({
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
const RegistrationOptions = () => {
  const router = useRouter();

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showRegistrationOptions, setShowRegistrationOptions] = useState(true);
  const [showEmailCodeForm, setShowEmailCodeForm] = useState(false);
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

  const toggleRegistrationForm = () => {
    setShowRegistrationForm(true);
    setShowRegistrationOptions(false);
    setShowEmailCodeForm(false);
  };

  const toggleRegistrationOptions = () => {
    setShowRegistrationForm(false);
    setShowRegistrationOptions(true);
  };

  const toggleEmailCodeForm = () => {
    setShowEmailCodeForm(true);
    setShowRegistrationOptions(false);
    setShowRegistrationForm(false);
  };

  const handleDigitCodeConfirmation = () => {
    toggleEmailCodeForm();
  };

  const buttonsData = [
    {
      imageUrl: "svg/email.svg",
      altText: "Register with Email Icon",
      buttonText: "Register with Email",
      extraClasses: "bg-white text-gray-500",
      onClick: toggleRegistrationForm,
    },
    {
      imageUrl: "svg/google.svg",
      altText: "Register with Google Icon",
      buttonText: "Register with Google",
      extraClasses: "bg-white text-gray-500",
      onClick: () => login(),
    },
    {
      imageUrl: "svg/apple.svg",
      altText: "Register with Apple Icon",
      buttonText: "Register with Apple",
      extraClasses: "bg-black text-white",
      onClick: () => alert("Register with Apple clicked"),
    },
    {
      imageUrl: "svg/facebook.svg",
      altText: "Register with Facebook Icon",
      buttonText: "Register with Facebook",
      extraClasses: "bg-blue-600 text-white",
      onClick: () => alert("Register with Facebook clicked"),
    },
  ];

  return (
    <div className="h-screen overflow-auto bg-[length:1920px_1024px] bg-[url('/background.jpg')] flex flex-col items-center justify-center">
      {showRegistrationOptions && (
        <div className="flex items-center justify-center min-h-screen">
          <section className="flex flex-col items-center px-7 pt-4 pb-6 text-xl font-medium text-white rounded-xl bg-zinc-800 max-w-[400px]">
            <header className="flex justify-between w-full  mb-4"></header>
            <main className="w-full">
              {buttonsData.map((button, index) => (
                <React.Fragment key={index}>
                  <RegisterButton
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
                onClick={() => router.push("/signin")}
              >
                <span style={{ fontSize: "0.8rem" }}>
                  Have account? Sign In
                </span>
              </div>
            </main>
          </section>
        </div>
      )}
      {showRegistrationForm && (
        <RegistrationForm onClose={toggleRegistrationOptions} />
      )}
      {showEmailCodeForm && (
        <DigitCodeConfirmation onClose={toggleRegistrationForm} />
      )}
      <NotificationContainer />
    </div>
  );
};

export default RegistrationOptions;

// Registration Form Component
const RegistrationForm = ({ onClose }) => {
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [submitted, setSubmitted] = useState(false); // Track form submission

  const schema = new passwordValidator();

  // Add properties to it
  schema
    .is()
    .min(8) // Minimum length 8
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .symbols();

  // Signup Logic Functions
  const ValidateEmail = (email) => {
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex);
  };

  const validateForm = () => {
    if (userData.fullname == "") {
      NotificationManager.error("Full Name is required.", "Error", 2000);
      return false;
    } else if (userData.fullname.trim().length < 3) {
      NotificationManager.error(
        "Full Name must be at least 3 characters long.",
        "Error",
        2000
      );
      return false;
    }

    if (!userData.email.trim()) {
      NotificationManager.error("Email is required.", "Error", 2000);
      return false;
    } else if (!ValidateEmail(userData.email)) {
      NotificationManager.error("Email is invalid.", "Error", 2000);
      return false;
    }
    if (!userData.password.trim()) {
      NotificationManager.error("Password is required.", "Error", 2000);
      return false;
    } else if (!schema.validate(userData.password)) {
      NotificationManager.error(
        "Password must contain at least 8 characters including uppercase letters, lowercase letters, special characters, and digits. For example: MyP@ssw0rd, 123$Secure, StrongPass#99.",
        "Error",
        2000
      );
      return false;
    }
    if (!userData.confirmpassword.trim()) {
      NotificationManager.error("Confirm Password is required", "Error", 2000);
      return false;
    } else if (userData.confirmpassword !== userData.password) {
      NotificationManager.error("Passwords do not match", "Error", 2000);
      return false;
    }

    return true;
  };

  const SignUp = (userData) => {
    console.log("userData", userData);
    setSubmitted(true);
    axios
      .post(`${apiURL}/auth/signup`, userData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status === 200) {
          NotificationManager.success(response.data.message);
          setTimeout(() => {
            if (response.data.status) {
              localStorage.setItem("token", response.data.data.token);
              localStorage.setItem("userID", response.data.data.user_id);
              localStorage.setItem("email", response.data.data.email);
              localStorage.setItem("fullname", response.data.name);
              router.push("/");
            }
          }, 2000); // 3000 milliseconds = 3 seconds
        } else {
          NotificationManager.error(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Server error:", error.response.data);
          NotificationManager.error(error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response from server:", error.request);
          NotificationManager.error("No response from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error:", error.message);
          NotificationManager.error("An error occurred: " + error.message);
        }
      });
  };

  const handleInputChange = (e) => {
    // validateForm(userData);
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      SignUp(userData);
    }
  };

  return (
    <form className="flex flex-col px-12 pt-6 pb-9 text-base font-medium text-white rounded-xl bg-zinc-800 max-w-[800px]">
      <img
        loading="lazy"
        src="svg/close.svg"
        alt=""
        onClick={onClose}
        className="self-end aspect-square w-[18px]"
      />
      <h1 className="self-center mt-1.5 text-5xl text-white font-nasalization">
        Register
      </h1>
      <InputField
        label="Full Name"
        name="fullname"
        value={userData.fullname}
        onChange={handleInputChange}
        error={formErrors.fullname}
      />
      <InputField
        label="E-mail"
        type="email"
        name="email"
        value={userData.email}
        onChange={handleInputChange}
        error={formErrors.email}
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={userData.password}
        onChange={handleInputChange}
        error={formErrors.password}
      />
      <InputField
        label="Confirm Password"
        type="password"
        name="confirmpassword"
        value={userData.confirmpassword}
        onChange={handleInputChange}
        error={formErrors.confirmpassword}
      />
      <button
        className={`justify-center items-center px-16 py-2 mt-9 text-white rounded-xl bg-gradient-to-r from-[#7B88FF] to-[#64D0FF] hover:bg-blue-700 focus:ring-4 focus:ring-blue-300`}
        type="button"
        onClick={handleSubmit}
      >
        Register
      </button>

      <div
        tabIndex="0"
        role="button"
        className="flex justify-center items-center px-16 py-2.5 mt-5 text-white rounded-xl border border-indigo-400 border-solid text-center"
        onClick={() => router.push("/signin")}
      >
        <span style={{ fontSize: "0.8rem" }}>Have account? Sign In</span>
      </div>
    </form>
  );
};

const DigitCodeConfirmation = ({ onClose }) => {
  // State to store the entered code
  const initialCodeState = ["", "", "", ""];
  const [code, setCode] = useState(initialCodeState);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleDigitInput = (event, index) => {
    const { value } = event.target;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (index < 3 && value !== "") {
      // Move focus to the next input box
      refs[index + 1].current.focus();
    }
  };

  return (
    <section className="flex flex-col px-6 pt-5 pb-9 rounded-xl bg-zinc-800 max-w-[400px]">
      <header className="flex justify-end">
        <img
          loading="lazy"
          src="svg/close.svg"
          alt=""
          onClick={onClose}
          className="self-end aspect-square w-[18px]"
        />
      </header>
      <h1 className="self-center mt-2 text-5xl text-center text-white whitespace-nowrap font-nasalization">
        4 Digit Code
      </h1>
      <div className="flex gap-2.5 self-center mt-9 max-w-full w-[248px]">
        {code.map((digit, index) => (
          <CodeInput
            key={index}
            index={index}
            forwardRef={refs[index]}
            onDigitInput={handleDigitInput}
          />
        ))}
      </div>
      <button
        className={`justify-center items-center px-16 py-2.5 mt-9 text-white rounded-xl bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300`}
        tabIndex="0"
      >
        Confirm
      </button>
    </section>
  );
};

const CodeInput = ({ onDigitInput, index, forwardRef }) => (
  <input
    ref={forwardRef}
    className="flex-1 shrink-0 rounded-lg border border-solid border-neutral-400 h-[58px] text-center text-xl font-medium text-white bg-transparent"
    style={{ width: "48px" }}
    maxLength="1"
    onChange={(e) => onDigitInput(e, index)}
    type="text"
  />
);
