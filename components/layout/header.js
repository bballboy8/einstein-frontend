"use client";

import React, { useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { useModelStatus } from "../context/ModelStatusContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = ({
  setUserActive,
  userActive,
  chatTitle,
  clickChat,
  setClickChat,
  setMobileStatus,
  setChatTitle
}) => {
  const { settingModel, setSettingModel } = useModelStatus();
  const { toggleStatus, setToggleStatus } = useModelStatus();
  const router = useRouter();

  return (
    <div className="flex justify-between px-[12px] max-mlg:px-0 py-[19px] bg-[#181818] max-msm:bg-[#000]">
      <div className="flex flex-row gap-2 max-mlg:hidden">
        <Image alt="" width={34} height={34} src={"/logo.png"} />
        <div className="text-[#FFF] text-[22px] pt-1 font-normal leading-normal font-nasalization">
          Einstein
        </div>
      </div>
      {clickChat == false ? (
        <div
          className={`flex flex-row justify-between mx-[16px] max-mlg:ml-0 max-mlg:rounded-br-3xl py-2 bg-[#0A84FF] mlg:rounded-b-3xl px-6 max-msm:px-3 mlg:hidden ${
            settingModel == true ? "hidden" : ""
          }`}
        >
          <div className="grid grid-cols-5 gap-3 text-base font-normal leading-normal font-nasalization">
            <p
              className={`w-1/5 text-center hover:text-[#FFF] hover:cursor-pointer`}
            >
              Text
            </p>
            <p
              className={`w-1/5 text-center hover:text-[#FFF] hover:cursor-pointer`}
            >
              Image
            </p>
          </div>
          <Image
            alt=""
            width={21}
            height={21}
            src={"/svg/plus.svg"}
            className="cursor-pointer"
          />
        </div>
      ) : (
        <div
          className={`flex flex-row justify-between mx-3 w-1/2 mlg:hidden ${
            userActive == true ? "hidden" : ""
          }`}
        >
          <Image
            alt=""
            width={11}
            height={18}
            src={"/svg/previous.svg"}
            onClick={() => {
              setClickChat(false);
              setMobileStatus(false);
              setSettingModel(0);
              setUserActive(false);
            }}
          />
          <div className="flex flex-col justify-end">
            {chatTitle?.length < 20
              ? chatTitle?.slice(0, 20)
              : chatTitle?.slice(0, 20).concat("...")}
          </div>
        </div>
      )}

      <div className="flex flex-row gap-4 mr-5 max-msm:mr-5">
        <Tooltip
          content={<p className="text-[#FFF]">Toggle models</p>}
          showArrow
          placement="bottom"
          delay={0}
          closeDelay={0}
          className=""
          classNames={{
            base: ["before:bg-[##2E353C]"],
            content: ["bg-[#2E353C] text-sm font-normal leading-4 px-3 py-2"]
          }}
          motionProps={{
            variants: {
              exit: {
                opacity: 0,
                transition: {
                  duration: 0.1,
                  ease: "easeIn"
                }
              },
              enter: {
                opacity: 1,
                transition: {
                  duration: 0.15,
                  ease: "easeOut"
                }
              }
            }
          }}
        >
          <Image
            alt="setting"
            width={20}
            height={20}
            src={
              settingModel == false
                ? "/svg/setting.svg"
                : "/svg/settingactive.svg"
            }
            className="cursor-pointer"
            onClick={() => {
              setToggleStatus(0);
              setSettingModel(1);
              // setClickChat(true);
              // setChatTitle("Models");
              router.push("/");
            }}
          />
        </Tooltip>
        <Image
          alt="user"
          width={16}
          height={20}
          className="cursor-pointer"
          src={userActive == false ? "/svg/user.svg" : "/svg/useractive.svg"}
          onClick={() => {
            setToggleStatus(1);
            setUserActive(true);
            setSettingModel(false);
            router.push("/profile");
          }}
        />
      </div>
    </div>
  );
};

export default Header;
