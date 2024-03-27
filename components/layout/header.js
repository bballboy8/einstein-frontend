"use client";

import React, { useState, Fragment, useEffect } from "react";
import { Tooltip, Button } from "@nextui-org/react";
import { useModelStatus } from "../context/ModelStatusContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = ({
  setUserActive,
  userActive,
  chatTitle,
  clickChat,
  setClickChat,
  setMobileStatus,
  setChatTitle,
  settingModelStatus,
}) => {
  const { settingModel, setSettingModel } = useModelStatus();
  const { toggleStatus, setToggleStatus } = useModelStatus();
  const router = useRouter();
  useEffect(() => {
    if (settingModelStatus) {
      setSettingModel(true);
    }
  }, [settingModelStatus]);

  return (
    <div className="flex justify-between px-[12px] max-mlg:px-0 py-[19px] bg-[#181818] max-msm:bg-[#000]">
      <div className="flex flex-row gap-2 max-mlg:hidden">
        <Image alt="" width={34} height={34} src={"/logo.png"} />
        <div className="text-[#FFF] text-[22px] pt-1 font-normal leading-normal font-nasalization">
          Einstein
        </div>

        <Menu as="div" className="relative inline-block text-left">
          <div className="border-l-1 border-[#A5A5A5] ml-[12px] mt-[8px]">
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5  px-3 py-0 pl-[15px] text-[#D2D2D2] text-[16px]   font-nasalization">
              Personal
              <ChevronDownIcon
                className="-mr-1 h-5 w-5 text-[#D2D2D2]"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 min-w-[243px] origin-top-right rounded-[20px] bg-[#181818] border border-[#313535] overflow-hidden	">
              <div className="py-0">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-[#445059] " : "text-gray-700",
                        "px-4 py-2 flex flex-row border-b-1 border-[#313535]"
                      )}
                    >
                      <div className="min-w-6 h-6 max-msm:w-12 max-msm:h-12 bg-radial-gradient rounded-full flex flex-row items-center justify-center">
                        <p className="text-[#E9ECEF] text-[13px] font-helvetica font-medium leading-normal">
                          P
                        </p>
                      </div>
                      <div className="flex flex-1 flex-col ml-2 mt-[1px] w-full font-nasalization text-[14px] text-[#fff]">
                        Personal
                      </div>
                    </a>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-[#445059] " : "text-gray-700",
                        "px-4 py-2 flex flex-row border-b-1 border-[#313535]"
                      )}
                    >
                      <div className="min-w-6 h-6 max-msm:w-12 max-msm:h-12 bg-radial-gradient rounded-full flex flex-row items-center justify-center">
                        <p className=" text-[#E9ECEF] text-[13px] font-helvetica font-medium leading-normal">
                          B
                        </p>
                      </div>
                      <div className="flex flex-1 flex-col ml-2 mt-[1px] w-full font-nasalization text-[14px] text-[#fff]">
                        Business
                      </div>
                    </a>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-[#445059] " : "text-gray-700",
                        "px-4 py-2 flex flex-row border-b-1 border-[#313535]"
                      )}
                    >
                      <div className="min-w-6 h-6 max-msm:w-12 max-msm:h-12 bg-radial-gradient rounded-full flex flex-row items-center justify-center">
                        <p className=" text-[#E9ECEF] text-[13px] font-helvetica font-medium leading-normal">
                          N
                        </p>
                      </div>
                      <div className="flex flex-1 flex-col ml-2 mt-[1px] w-full font-nasalization text-[14px] text-[#fff]">
                        New Work Space
                      </div>
                    </a>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-[#445059] " : "text-gray-700",
                        "px-4 py-2 flex flex-row border-b-1 border-[#313535]"
                      )}
                    >
                      <div className="min-w-6 h-6 max-msm:w-12 max-msm:h-12  flex flex-row items-center justify-center">
                        <p className=" text-[#E9ECEF] text-[13px] font-helvetica font-medium leading-normal">
                          <PlusCircleIcon className="h-6 w-6 text-white" />
                        </p>
                      </div>
                      <div className="flex flex-1 flex-col ml-2 mt-[1px] w-full font-nasalization text-[14px] text-[#fff]">
                        Create New Workspace
                      </div>
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
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
        {/* {userActive == true ? (
          <Button className="h-14 gr-1 rounded-full min-w-[115px] text-[#fff] leading-normal font-helvetica h-[42px]">
            <Image
              alt="user"
              width={16}
              height={20}
              className="cursor-pointer"
              src="svg/user.svg"
            />
            Sign in
          </Button>
        ) : null} */}

        <Tooltip
          content={<p className="text-[#FFF]">Toggle models</p>}
          showArrow
          placement="bottom"
          delay={0}
          closeDelay={0}
          className=""
          classNames={{
            base: ["before:bg-[##2E353C]"],
            content: ["bg-[#2E353C] text-sm font-normal leading-4 px-3 py-2"],
          }}
          motionProps={{
            variants: {
              exit: {
                opacity: 0,
                transition: {
                  duration: 0.1,
                  ease: "easeIn",
                },
              },
              enter: {
                opacity: 1,
                transition: {
                  duration: 0.15,
                  ease: "easeOut",
                },
              },
            },
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

        <Tooltip
          content={<p className="text-[#FFF]">Profile</p>}
          showArrow
          placement="bottom"
          delay={0}
          closeDelay={0}
          className=""
          classNames={{
            base: ["before:bg-[##2E353C]"],
            content: ["bg-[#2E353C] text-sm font-normal leading-4 px-3 py-2"],
          }}
          motionProps={{
            variants: {
              exit: {
                opacity: 0,
                transition: {
                  duration: 0.1,
                  ease: "easeIn",
                },
              },
              enter: {
                opacity: 1,
                transition: {
                  duration: 0.15,
                  ease: "easeOut",
                },
              },
            },
          }}
        >
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
        </Tooltip>
      </div>
    </div>
  );
};

export default Header;
