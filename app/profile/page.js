"use client";

import React, { useEffect, useState } from "react";
import { useModelStatus } from "@/components/context/ModelStatusContext";
import Header from "@/components/layout/header";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { apiURL } from "@/config";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const Index = () => {
  const { settingModel, setSettingModel } = useModelStatus();
  const [id, setID] = useState(0);
  const [upgradeStatus, setUpgradeStatus] = useState(false);
  const [email, setEmail] = useState("");
  const [setting, setSetting] = useState(false);
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    company_name: "",
    job_title: "",
    use_case: "",
  });
  const [userInfo, setUserInfo] = useState({});

  const setMemberShipe = () => {
    axios
      .post("https://localhost:3000/api/stripe", {
        email: email,
      })
      .then((res) => {
        window.location.href = res.data.url;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateAccount = () => {
    console.log("update account", userData);
    axios
      .post(
        `${apiURL}/auth/update/`,
        { data: userData },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          NotificationManager.success(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserData = () => {
    console.log("get user data");
    let userEmail = localStorage.getItem("email");
    console.log(userEmail);

    axios
      .post(
        `${apiURL}/auth/getuser/`,
        { email: userEmail },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        console.log("response: ");
        console.log(response.data.data);
        setUserInfo(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let user_email = localStorage.getItem("email");
    setEmail(user_email);
    setUserData({ ...userData, email: user_email });
  }, []);

  useEffect(() => {
    getUserData();
  }, [id]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 flex-row overflow-auto pb-2 max-msm:bg-[#000]">
        <div
          className={`flex flex-col gap-12 sm:max-w-[335px] max-sm:mr-3 w-full h-full rounded-3xl bg-[rgba(39,45,51,0.70)] ml-3 px-4 max-msm:px-0 max-msm:bg-[#000] ${
            setting == true ? "max-sm:hidden" : ""
          }`}
        >
          <Link href={"/"}>
            <div className="flex flex-row gap-3 mt-7 pl-4 cursor-pointer ">
              <Image alt="" width={11} height={20} src={"/svg/backchat.svg"} />
              <p className="text-[#C2C2C2] hover:text-[#FFF] text-2xl font-normal leading-normal font-nasalization">
                Chats
              </p>
            </div>
          </Link>
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
              <div className="w-12 h-12 rounded-full bg-radial-gradient flex flex-row items-center justify-center">
                <p className="text-[27px] text-[#E9ECEF] font-helvetica font-medium leading-normal">
                  {userInfo.full_name?.at(0)?.toUpperCase()}
                </p>
              </div>
              <div className="flex flex-col justify-center ">
                <p className=" text-[#FFF] text-base font-helvetica font-bold leading-normal">
                  {userInfo.full_name}
                </p>
                <p className=" text-[#FFF] text-base font-helvetica font-light leading-normal">
                  {email}
                </p>
              </div>
            </div>
            <div
              className={`flex flex-row gap-4 py-5 px-3 mt-6 ${
                id == 0 ? "rounded-lg" : null
              } hover:rounded-lg hover:bg-[#445059] cursor-pointer`}
              onClick={() => {
                setID(0);
                setSetting(true);
              }}
            >
              <Image
                alt=""
                width={26}
                height={26}
                src={"/svg/profileaccount.svg"}
              />
              <p className="text-base text-[#FFF] font-bold font-helvetica leading-normal pt-[3px]">
                Account Settings
              </p>
            </div>
            <div
              className={`flex flex-row gap-4 py-5 px-3 ${
                id == 1 ? "rounded-lg bg-[#445059]" : null
              } hover:rounded-lg hover:bg-[#445059] cursor-pointer`}
              onClick={() => {
                setID(1);
                setSetting(true);
              }}
            >
              <Image alt="" width={24} height={18} src={"/svg/credit.svg"} />
              <p className="text-base text-[#FFF] font-bold font-helvetica leading-normal">
                Billing
              </p>
            </div>
            <div
              className={`flex flex-row gap-4 py-5 px-4 ${
                id == 2 ? "rounded-lg bg-[#445059]" : null
              } hover:rounded-lg hover:bg-[#445059] cursor-pointer`}
              onClick={() => setID(2)}
            >
              <Image alt="" width={18} height={18} src={"/svg/logout.svg"} />
              <p className="text-base text-[#FFF] font-bold font-helvetica leading-normal">
                Sign out
              </p>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-1 flex-col overflow-auto pl-8 max-sm:px-4 max-msm:bg-[#000] max-lg:pr-2 ${
            setting == true ? "" : "max-sm:hidden"
          }`}
        >
          {id == 0 ? (
            <div
              className={`flex flex-col gap-6 ${
                setting == true ? "" : "max-sm:hidden"
              }`}
            >
              <p className=" text-2xl font-bold font-helvetica text-[#FFF]">
                Account Settings
              </p>
              <div className=" rounded-lg border-[0.5px] border-solid border-[#C2C2C2] px-6 py-3 max-w-[640px] w-full">
                <p className="text-[#FFF] text-xs font-medium leading-4">
                  Full Name*
                </p>
                <input
                  className="text-[#FFF] outline-none bg-[rgba(47,55,62,0.00)] mt-1 w-full"
                  defaultValue={userInfo.full_name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
              </div>
              <div className=" rounded-lg border-[0.5px] border-solid border-[#C2C2C2] px-6 py-3 max-w-[640px] w-full">
                <p className="text-[#FFF] text-xs font-medium leading-4">
                  Email*
                </p>
                <input
                  className="text-[#FFF] outline-none bg-[rgba(47,55,62,0.00)] mt-1 w-full opacity-50"
                  defaultValue={email}
                  disabled
                />
              </div>
              <div className=" rounded-lg border-[0.5px] border-solid border-[#C2C2C2] px-6 py-3 max-w-[640px] w-full">
                <p className="text-[#FFF] text-xs font-medium leading-4">
                  Company or Organization
                </p>
                <input
                  className="text-[#FFF] outline-none bg-[rgba(47,55,62,0.00)] mt-1 w-full"
                  onChange={(e) =>
                    setUserData({ ...userData, company_name: e.target.value })
                  }
                  defaultValue={userInfo.company_name}
                />
              </div>
              <div className=" rounded-lg border-[0.5px] border-solid border-[#C2C2C2] px-6 py-3 max-w-[640px] w-full">
                <p className="text-[#FFF] text-xs font-medium leading-4">
                  Job Title
                </p>
                <input
                  className="text-[#FFF] outline-none bg-[rgba(47,55,62,0.00)] mt-1 text-[#FFFF] w-full"
                  onChange={(e) =>
                    setUserData({ ...userData, job_title: e.target.value })
                  }
                  defaultValue={userInfo.job_title}
                />
              </div>
              <div className=" rounded-lg border-[0.5px] border-solid border-[#C2C2C2] px-6 py-3 max-w-[640px] w-full">
                <p className="text-[#FFF] text-xs font-medium leading-4 w-full">
                  Use Case
                </p>
                <input
                  className="text-[#FFF] outline-none bg-[rgba(47,55,62,0.00)] mt-1"
                  onChange={(e) =>
                    setUserData({ ...userData, use_case: e.target.value })
                  }
                  defaultValue={userInfo.use_case}
                />
              </div>
              <div className="max-w-[640px] w-full flex flex-col items-end">
                <Button
                  color="primary"
                  variant="bordered"
                  className="text-base font-bold leading-normal"
                  onClick={() => updateAccount()}
                >
                  Update Account
                </Button>
              </div>
            </div>
          ) : id == 1 ? (
            <div className="flex flex-col max-sm:mt-0 max-w-[1212px] w-full max-2xl:pr-2">
              <div className="text-[#FFF] text-2xl font-bold leading-normal max-sm:hidden">
                Billing
              </div>
              <div className="text-[#FFF] text-base font-helvetica font-light leading-normal mt-6 max-sm:hidden">
                Track your spending, update your billing details, and download
                your invoices. You will be billed a flat fee of $9.99 each month
                and charged for additional usage on the 3rd of each month. You
                can set usage limits to limit your spending upon upgrading.
              </div>
              {upgradeStatus == false ? (
                <div className="flex flex-col">
                  <div className="flex flex-col gap-4 rounded-3xl bg-[#23272B] p-8 mt-[52px]">
                    <p className="text-[#FFF] text-base font-bold leading-normal">
                      Free Trial Credits
                    </p>
                    <p className="text-[#FFF] text-2xl font-medium leading-normal font-helvetica">
                      ${userInfo.price} out of $5.00 in credits remaining
                    </p>
                    <div className="bg-[#95B0E8] h-1"></div>
                    <p className="text-base text-[#FFF] font-light leading-normal font-helvetica">
                      You are currently using afree trial. For Full access,
                      without limits, you can upgrade to a a paid account at any
                      time.
                    </p>
                    <div className="max-w-max">
                      <Button
                        color="primary"
                        size="lg"
                        radius="full"
                        className="text-[#FFF] text-base font-bold leading-normal font-helvetica"
                        onClick={() => setUpgradeStatus(true)}
                      >
                        Upgrade Account
                      </Button>
                    </div>
                  </div>
                  <div className="bg-[#23272B] rounded-3xl max-w-[590px] w-full p-8 mx-auto mt-12">
                    <p className="text-[#FFF] font-helvetica text-2xl font-medium leading-normal">
                      Upgrade plan
                    </p>
                    <div className=" text-5xl font-helvetica font-medium leading-normal text-center text-[#FFF]">
                      <p>$7.00 per month.</p>
                      <p>Every Top AI Model.</p>
                      <Button
                        size="lg"
                        className=" text-[26px] text-[#FFF] font-bold font-helvetica leading-normal py-7 px-10"
                        color="primary"
                        radius="full"
                        onClick={() => setMemberShipe()}
                      >
                        Upgrade to EMC
                      </Button>
                      <p className=" text-xs font-helvetica text-[#FFF] font-light max-w-[370px] w-full mx-auto mt-4">
                        *If usage goes over, you will begin paying on a usage
                        basis. (Don’t worry, you will be notifiexd when you are
                        getting close to this.)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-7 mt-[52px]">
                  <div className="flex flex-col gap-4 bg-[#23272B] rounded-3xl p-8">
                    <p className="text-base text-[#FFF] font-bold font-helvetica leading-normal">
                      Free Trial Credits
                    </p>
                    <p className="text-2xl text-[#FFF] font-medium font-helvetica leading-normal">
                      $25.00 out of $25 in credits remaining
                    </p>
                    <div className="bg-[#95B0E8] h-1"></div>
                  </div>
                  <div className="flex flex-col bg-[#23272B] rounded-3xl p-8">
                    <p className="text-base text-[#FFF] font-bold font-helvetica leading-normal mb-8">
                      Payment Method
                    </p>
                    <div className="flex flex-row rounded justify-between bg-[rgba(217,217,217,0.07)] px-3 py-2">
                      <div className="flex flex-row gap-2">
                        <Image
                          alt=""
                          width={18}
                          height={14}
                          src={"/svg/paycredit.svg"}
                        />
                        <div className="text-[#86868B] text-xs font-medium leading-4">
                          Visa **** **** **** 9991
                        </div>
                      </div>
                      <div className="text-[#FFF] text-xs font-medium font-montserrat leading-4">
                        Edit
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col mt-8 gap-7 max-w-max">
              <p className=" text-2xl font-bold leading-normal text-[#FFF] font-helvetica">
                Sign Out
              </p>
              <Link href={"/register"}>
                <div
                  className="px-7 py-4 flex flex-row gap-4 bg-[#445059] rounded-lg cursor-pointer"
                  onClick={() => localStorage.clear()}
                >
                  <Image
                    alt=""
                    width={18}
                    height={18}
                    src={"/svg/logout.svg"}
                  />
                  <p className="text-base text-[#FFF] font-bold font-helvetica">
                    Sign out
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Index;
