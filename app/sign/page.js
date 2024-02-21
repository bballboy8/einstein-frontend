"use client";

import React, { useState } from "react";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { apiURL } from "@/config";

const Index = () => {
  const router = useRouter();
  const [flag, setFlag] = useState(0);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: ""
  });
  const [logData, setLogData] = useState({
    username: "",
    password: ""
  });
  const [validStatus, setValidStatus] = useState(false);
  const [lengthValid, setLengthValid] = useState(false);
  const [validEmailStatus, setValidEmailStatus] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [confirmpassVisible, setConfirmpassVisible] = useState(false);
  const [logpassVisible, setLogpassVisible] = useState(false);

  const passVisibleFunc = () => {
    if (passVisible == true) setPassVisible(false);
    else setPassVisible(true);
  };

  const confirmpassVisibleFunc = () => {
    if(confirmpassVisible == true) setConfirmpassVisible(false);
    else setConfirmpassVisible(true);
  };

  const logpassVisibleFunc = () => {
    if(logpassVisible == true) setLogpassVisible(false);
    else setLogpassVisible(true);
  };

  const ValidateEmail = (e) => {
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (e.target.value.match(validRegex)) {
      setValidEmailStatus(false);
    } else {
      setValidEmailStatus(true);
    }
  };

  const SignUp = () => {
    console.log(userData);
    if (
      userData.firstname == "" ||
      userData.lastname == "" ||
      userData.username == "" ||
      userData.email == "" ||
      userData.password == "" ||
      userData.confirmpassword == ""
    ) {
      setValidStatus(true);
    } else if (
      userData.firstname.length < 3 ||
      userData.lastname.length < 3 ||
      userData.username.length < 3 ||
      userData.password.length < 3 ||
      userData.confirmpassword.length < 3
    ) {
      setLengthValid(true);
    } else if (userData.password != userData.confirmpassword) {
      NotificationManager.error("Enter password correctly");
    } else {
      if (validEmailStatus == false) {
        axios
          .post(`${apiURL}/auth/signup`, userData, {
            headers: { "Content-Type": "application/json" }
          })
          .then((response) => {
            NotificationManager.success(response.data.message);
            setFlag(0);
          });
      } else {
        return;
      }
    }
  };

  const SignIn = () => {
    console.log(logData);
    axios
      .post(`${apiURL}/auth/signin`, logData, {
        headers: { "Content-Type": "application/json" }
      })
      .then((response) => {
        console.log(response.data);
        if (response.status == 201) {
          NotificationManager.warning(response.data.message, "Warning");
        }
        if (response.status == 200) {
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
      });
  };

  return (
    <div className="h-screen overflow-auto bg-[length:1920px_1024px] bg-[url('/bg.png')] flex flex-col items-center">
      <div className="w-full max-w-[520px] my-auto msm-max:max-w-[330px]">
        <div className="flex flex-row gap-2 justify-center">
          <Image alt="" width={64} height={64} src={"/logo.png"} />
          <p className="text-[40px] font-nasalization font-normal leading-normal text-[#FAF9FB]">
            Einstein
          </p>
        </div>
        {flag == 0 ? (
          <div className="flex flex-col my-[130px] md-max:my-[50px]">
            <div className="flex flex-col gap-6">
              <p className="text-2xl font-medium leading-normal text-[#FFF]">
                Log in to your account
              </p>
              <div className="bg-[#23272B] rounded-[20px] border-[0.5px] border-solid border-[#C9C9C9] flex flex-col py-4 px-5 md-max:py-2 md-max:px-3">
                <p className="text-[#FFF] text-[12px] font-medium leading-[16px]">
                  Username or email
                </p>
                <input
                  className="bg-[#23272B] border-none outline-none text-[#FFF]"
                  onChange={(e) =>
                    setLogData({ ...logData, username: e.target.value })
                  }
                />
              </div>
              <div className="bg-[#23272B] rounded-[20px] border-[0.5px] border-solid border-[#C9C9C9] flex flex-col py-4 px-5 md-max:py-2 md-max:px-3">
                <p className="text-[#FFF] text-[12px] font-medium leading-[16px]">
                  Password
                </p>
                <div className="relative flex w-full">
                  <input
                    type={logpassVisible == true ? "text" : "password"}
                    className="flex flex-col flex-1 bg-[#23272B] border-none outline-none text-[#FFF]"
                    onChange={(e) =>
                      setLogData({ ...logData, password: e.target.value })
                    }
                  />
                  <Image
                    alt=""
                    width={30}
                    height={30}
                    className="ml-1"
                    onClick={() => logpassVisibleFunc()}
                    src={logpassVisible == true ? "/svg/eye.svg" : "/svg/eyeslash.svg"}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6 mt-[76px]">
              <p className="text-base text-[#FFF] font-normal leading-[24px]">
                Forgot your password?
              </p>
              <div className="flex flex-col">
                <button
                  className="py-5 md-max:py-3 md-max:text-base rounded-[20px] bg-[#FFF] text-[#23272B] font-medium leading-[35px] text-2xl"
                  onClick={() => SignIn()}
                >
                  Sign In
                </button>
              </div>
              <div className="flex flex-row gap-2 text-base font-normal">
                <p className="text-[#BDBDBD]">Dont have an account?</p>
                <p
                  className="cursor-pointer text-[#FFF]"
                  onClick={() => {
                    setFlag(1);
                  }}
                >
                  Sign Up
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col my-5">
            <div className="text-[#FFF] leading-normal flex flex-col gap-4">
              <p className="text-2xl font-normal">Create an Account</p>
              <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                  <Image
                    alt=""
                    width={24}
                    height={24}
                    src={"/svg/account.svg"}
                  />
                  <p className=" text-xl font-medium">Account Information</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-6 mt-[60px]">
                <div className="grid grid-cols-2 gap-6 w-full">
                  <div>
                    <div className="bg-[#23272B] rounded-[20px] border-[0.5px] border-solid border-[#C9C9C9] flex flex-col py-4 px-5 sm-max:py-2 sm-max:px-3">
                      <p className="text-[#FFF] text-[12px] font-medium leading-[16px]">
                        First Name*
                      </p>
                      <input
                        className=" bg-[#23272B] border-none outline-none text-[#FFF]"
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            firstname: e.target.value
                          })
                        }
                      />
                    </div>
                    {validStatus == true && userData.firstname == "" ? (
                      <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                        This field is required!
                      </p>
                    ) : null}
                    {lengthValid == true && userData.firstname.length < 3 ? (
                      <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                        Please enter over 3 characters
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <div className="bg-[#23272B] rounded-[20px] border-[0.5px] border-solid border-[#C9C9C9] flex flex-col py-4 px-5 sm-max:py-2 sm-max:px-3">
                      <p className="text-[#FFF] text-[12px] font-medium leading-[16px]">
                        Last name*
                      </p>
                      <input
                        className=" bg-[#23272B] border-none outline-none text-[#FFF]"
                        onChange={(e) =>
                          setUserData({ ...userData, lastname: e.target.value })
                        }
                      />
                    </div>
                    {validStatus == true && userData.lastname == "" ? (
                      <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                        This field is required!
                      </p>
                    ) : null}
                    {lengthValid == true && userData.lastname.length < 3 ? (
                      <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                        Please enter over 3 characters
                      </p>
                    ) : null}
                  </div>
                </div>
                <div>
                  <div className="bg-[#23272B] rounded-[20px] border-[0.5px] border-solid border-[#C9C9C9] flex flex-col py-4 px-5 sm-max:py-2 sm-max:px-3">
                    <p className="text-[#FFF] text-[12px] font-medium leading-[16px]">
                      Username*
                    </p>
                    <input
                      className=" bg-[#23272B] border-none outline-none text-[#FFF]"
                      onChange={(e) =>
                        setUserData({ ...userData, username: e.target.value })
                      }
                    />
                  </div>
                  {validStatus == true && userData.username == "" ? (
                    <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                      This field is required!
                    </p>
                  ) : null}
                  {lengthValid == true && userData.username.length < 3 ? (
                    <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                      Please enter over 3 characters
                    </p>
                  ) : null}
                </div>
                <div>
                  <div className="bg-[#23272B] rounded-[20px] border-[0.5px] border-solid border-[#C9C9C9] flex flex-col py-4 px-5 sm-max:py-2 sm-max:px-3">
                    <p className="text-[#FFF] text-[12px] font-medium leading-[16px]">
                      Email*
                    </p>
                    <input
                      className=" bg-[#23272B] border-none outline-none text-[#FFF]"
                      onChange={(e) => {
                        setUserData({ ...userData, email: e.target.value });
                        ValidateEmail(e);
                      }}
                    />
                  </div>
                  {validStatus == true && userData.email == "" ? (
                    <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                      This field is required!
                    </p>
                  ) : null}
                  {validEmailStatus == true ? (
                    <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                      This email is invalid!
                    </p>
                  ) : null}
                </div>
                <div>
                  <div className="bg-[#23272B] rounded-[20px] border-[0.5px] border-solid border-[#C9C9C9] flex flex-col py-4 px-5 sm-max:py-2 sm-max:px-3">
                    <p className="text-[#FFF] text-[12px] font-medium leading-[16px]">
                      Password*
                    </p>
                    <div className="relative flex w-full">
                      <input
                        type={passVisible == true ? "text" : "password"}
                        className="flex flex-col flex-1 bg-[#23272B] border-none outline-none text-[#FFF]"
                        onChange={(e) =>
                          setUserData({ ...userData, password: e.target.value })
                        }
                      />
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        className="ml-1"
                        onClick={() => passVisibleFunc()}
                        src={
                          passVisible == true ? "/svg/eye.svg" : "/svg/eyeslash.svg"
                        }
                      />
                    </div>
                  </div>
                  {validStatus == true && userData.password == "" ? (
                    <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                      This field is required!
                    </p>
                  ) : null}
                  {lengthValid == true && userData.password.length < 3 ? (
                    <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                      Please enter over 3 characters
                    </p>
                  ) : null}
                </div>
                <div>
                  <div className="bg-[#23272B] rounded-[20px] border-[0.5px] border-solid border-[#C9C9C9] flex flex-col py-4 px-5 sm-max:py-2 sm-max:px-3">
                    <p className="text-[#FFF] text-[12px] font-medium leading-[16px]">
                      Confirm Password*
                    </p>
                    <div className="relative flex w-full">
                      <input
                        type={confirmpassVisible == true ? "text" : "password"}
                        className="flex flex-col flex-1 bg-[#23272B] border-none outline-none text-[#FFF]"
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            confirmpassword: e.target.value
                          })
                        }
                      />
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        className="ml-1"
                        onClick={() => confirmpassVisibleFunc()}
                        src={
                          confirmpassVisible == true ? "/svg/eye.svg" : "/svg/eyeslash.svg"
                        }
                      />
                    </div>
                  </div>
                  {validStatus == true && userData.confirmpassword == "" ? (
                    <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                      This field is required!
                    </p>
                  ) : null}
                  {lengthValid == true &&
                  userData.confirmpassword.length < 3 ? (
                    <p class="mt-1 text-base font-medium text-red-600 dark:text-red-500">
                      Please enter over 3 characters
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-[30px]">
                <div className="flex flex-col ">
                  <button
                    className="py-5 sm-max:py-3 sm-max:text-base rounded-[20px] bg-[#FFF] text-[#23272B] font-medium leading-[35px] text-2xl"
                    onClick={() => SignUp()}
                  >
                    Next
                  </button>
                </div>
                <div className="flex flex-row gap-2 text-base font-normal">
                  <p className="text-[#BDBDBD]">Already have an account?</p>
                  <p
                    className="cursor-pointer text-[#FFF]"
                    onClick={() => {
                      setFlag(0);
                    }}
                  >
                    Sign In
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row justify-center text-[#FFF] text-sm font-normal leading-normal font-montserrat mb-5">
          © 2024 Einstein. All rights reserved.
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Index;
