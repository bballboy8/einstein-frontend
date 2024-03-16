"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useModelStatus } from "../context/ModelStatusContext";
import { useNewChat } from "../context/NewChatContext";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
  contextMenu,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { apiURL } from "@/config";

const HistorySider = ({
  NewChat,
  setChatHistoryID,
  setImgHistoryID,
  setChatStatus,
  historySideData,
  setHistorySideData,
  setChatTitle,
  // setMobileStatus,
  setClickChat,
  mobileStatus,
  imageModel,
  setImageModel,
  setChatHistoryData,
  setImgHistoryData,
}) => {
  const { settingModel, setSettingModel } = useModelStatus();
  const { toggleStatus, setToggleStatus } = useModelStatus();
  const { newChatData, setNewChatData } = useNewChat([]);
  const [generateType, setGenerateType] = useState(0);
  const [id, setID] = useState();

  const displayContextMenu = (event, id) => {
    contextMenu.show({
      id,
      event,
    });
  };

  const handleItemClick = ({ event, props, triggerEvent, data }) => {
    console.log(event, props, triggerEvent, data);
  };

  const getHistoryData = () => {
    console.log("Get History is calling!");
    setNewChatData([]);
    const userID = localStorage.getItem("userID");
    const data = {
      id: userID,
    };
    axios
      .post(`${apiURL}/ai/gethistory`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setHistorySideData(response.data.data);
      });
  };

  const getImgSideData = () => {
    setNewChatData([]);
    const userID = localStorage.getItem("userID");
    const data = {
      id: userID,
    };
    axios
      .post(`${apiURL}/img/gethistory`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setHistorySideData(response.data.data);
      });
  };

  const search = (filterData) => {
    console.log(filterData);
    let data = {
      searchString: filterData,
      id: localStorage.getItem("userID"),
    };
    axios
      .post(`${apiURL}/ai/search`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data.data);
        setNewChatData(response.data.data);
      });
  };

  useEffect(() => {
    console.log("---> this useEffect called!");

    setNewChatData(historySideData);
  }, [historySideData]);

  useEffect(() => {
    console.log("this useEffect called!");

    if (imageModel == false) getHistoryData();
    else getImgSideData();
  }, [imageModel]);

  return (
    <div
      className={`flex flex-col max-w-[335px] w-full max-mlg:max-w-full max-mlg:mr-3 h-full rounded-3xl max-msm:bg-[#000] bg-[rgba(39,45,51,0.70)] ml-3 px-[18px] max-msm:ml-0 max-msm:px-0 ${
        mobileStatus == true || settingModel == true ? " max-mlg:hidden" : null
      }`}
    >
      <div className="flex flex-row justify-between mx-[6px] max-msm:ml-0 max-msm:rounded-br-3xl py-2 bg-[#0A84FF] msm:rounded-b-3xl px-6 max-mlg:hidden">
        <div className="flex flex-row gap-8 text-base font-normal leading-normal font-nasalization">
          <p
            className={`w-1/5 text-center ${
              generateType == 0 ? "text-[#FFF]" : "text-[#D2D2D2]"
            } hover:text-[#FFF] hover:cursor-pointer`}
            onClick={() => {
              setGenerateType(0);
              setImageModel(false);
              setChatStatus(false);
              setImgHistoryID("");
              setImgHistoryData([]);
            }}
          >
            Text
          </p>
          <p
            className={`w-1/5 text-center ${
              generateType == 1 ? "text-[#FFF]" : "text-[#D2D2D2]"
            } hover:text-[#FFF] hover:cursor-pointer`}
            onClick={() => {
              setGenerateType(1);
              setImageModel(true);
              setChatStatus(false);
              setChatHistoryID("");
              setChatHistoryData([]);
            }}
          >
            Image
          </p>
        </div>
        <Tooltip
          content={<p className="text-[#FFF]">Models</p>}
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
            alt=""
            width={21}
            height={21}
            src={"/svg/plus.svg"}
            className="cursor-pointer"
          />
        </Tooltip>
      </div>
      <div className="flex flex-row gap-2 mt-6 max-msm:mt-0 mb-4 max-msm:ml-3">
        <div className="relative bg-[#2D2F33] flex gap-2 items-center rounded-lg w-full h-auto px-2 py-1.5 z-[2]">
          <Image alt="" width={24} height={24} src={"svg/search.svg"} />
          <input
            name="search"
            placeholder="Search"
            className="text-[#FFF] text-[14px] w-full bg-transparent outline-none rounded font-normal leading-normal ml-1"
            onChange={(e) => search(e.target.value)}
          />
        </div>
        <Tooltip
          content={<p className="text-[#FFF]">New Chat</p>}
          showArrow
          placement="bottom"
          delay={0}
          closeDelay={0}
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
            alt=""
            width={21}
            height={21}
            src={"svg/edit.svg"}
            className="hover:cursor-pointer"
            onClick={NewChat}
          />
        </Tooltip>
      </div>
      {imageModel == false ? (
        <div className="overflow-y-auto pb-4 w-full">
          {newChatData.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-row pt-4 hover:bg-[#445059] ${
                index == id ? "bg-[#445059]" : null
              } rounded-lg hover:cursor-pointer px-3`}
              onClick={() => {
                setToggleStatus(1);
                setChatStatus(true);
                setChatHistoryID(item.id);
                setID(index);
                setChatTitle(item.title);
                setSettingModel(false);
                // setMobileStatus(true);
                setClickChat(true);
              }}
              onContextMenu={(e) => displayContextMenu(e, "context-menu-basic")}
            >
              <div className="min-w-9 h-9 max-msm:w-12 max-msm:h-12 bg-radial-gradient rounded-full mt-4 flex flex-row items-center justify-center">
                {item.thumbnail_url ? ( // Check if thumbnail_url exists
                  // If thumbnail_url exists, display the Image component
                  <Image
                    src={item.thumbnail_url}
                    alt=""
                    width={36}
                    height={36}
                  />
                ) : (
                  // If thumbnail_url doesn't exist, display the fallback <p> tag
                  <p className="text-xl text-[#E9ECEF] font-helvetica font-medium leading-normal">
                    {item.title.at(0)?.toUpperCase()}
                  </p>
                )}
              </div>
              <div className="flex flex-1 flex-col ml-4 w-full">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-sm text-[#FFF] font-bold leading-normal">
                    {item.title.length < 18
                      ? item.title
                      : item.title.slice(0, 18).concat("...")}
                  </div>
                  <div className="text-sm font-helvetica font-normal leading-normal text-[#989693]">
                    <p>{item.date}</p>
                  </div>
                </div>
                <div className="w-[200px] max-mlg:w-full max-msm:w-[200px] mt-2">
                  <p className="text-sm text-[#B3B3B3] font-medium leading-normal font-helvetica">
                    {item.bot?.length <= 40
                      ? item.bot
                      : item.bot?.slice(0, 40).concat("...")}
                  </p>
                </div>
                <div className="mt-4 border-b border-[#565656]"></div>
              </div>
              <Menu id="context-menu-basic" animation={false}>
                <Item onClick={handleItemClick}>Delete</Item>
              </Menu>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto pb-4 w-full">
          {newChatData.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-row items-center hover:bg-[#445059] ${
                index == id ? "bg-[#445059]" : null
              } rounded-lg hover:cursor-pointer py-4 px-3`}
              onClick={() => {
                setToggleStatus(1);
                setChatStatus(true);
                setImgHistoryID(item.id);
                setID(index);
                setChatTitle(item.title);
                setSettingModel(false);
                // setMobileStatus(true);
                setClickChat(true);
              }}
              onContextMenu={(e) => displayContextMenu(e, "context-menu-basic")}
            >
              <div className="flex flex-row justify-center w-full">
                <div className="min-w-9 h-9 max-msm:w-12 max-msm:h-12 bg-radial-gradient rounded-full flex flex-row items-center justify-center">
                  {item.thumbnail_url ? ( // Check if thumbnail_url exists
                    // If thumbnail_url exists, display the Image component
                    <Image
                      src={item.thumbnail_url}
                      alt=""
                      width={36}
                      height={36}
                    />
                  ) : (
                    // If thumbnail_url doesn't exist, display the fallback <p> tag
                    <p className="text-xl text-[#E9ECEF] font-helvetica font-medium leading-normal">
                      {item.title.at(0)?.toUpperCase()}
                    </p>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center ml-4 w-full">
                  <div className="flex flex-row justify-between items-center">
                    <div className="text-sm text-[#FFF] font-bold leading-normal">
                      {item.title.length < 18
                        ? item.title
                        : item.title.slice(0, 18).concat("...")}
                    </div>
                    <div className="text-sm font-helvetica font-normal leading-normal text-[#989693]">
                      <p>{item.date}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Menu id="context-menu-basic" animation={false}>
                <Item onClick={handleItemClick}>Copy</Item>
                <Item onClick={handleItemClick}>Archive</Item>
                <Item onClick={handleItemClick}>Delete</Item>
              </Menu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySider;
