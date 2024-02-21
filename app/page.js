"use client";

import { useState } from "react";
import { useModelStatus } from "@/components/context/ModelStatusContext";
import Header from "@/components/layout/header";
import Chat from "@/components/chat";
import HistorySider from "@/components/layout/historysider";
import Model_Interface from "@/components/model_interface";

export default function Home() {
  const { settingModel, setSettingModel } = useModelStatus();
  const { toggleStatus, setToggleStatus } = useModelStatus();
  const [chatStatus, setChatStatus] = useState(false);
  const [chatHistroyID, setChatHistoryID] = useState("");
  const [imgHistoryID, setImgHistoryID] = useState("");
  const [chatHistroyData, setChatHistoryData] = useState([]);
  const [imgHistoryData, setImgHistoryData] = useState([])
  const [historySideData, setHistorySideData] = useState([]);
  const [chatTitle, setChatTitle] = useState("Chat Title");
  const [mobileStatus, setMobileStatus] = useState(false);
  const [userActive, setUserActive] = useState(false);
  const [clickChat, setClickChat] = useState(false);
  const [imageModel, setImageModel] = useState(false);

  const NewChat = () => {
    setToggleStatus(1)
    setChatStatus(false);
    setChatHistoryID("");
    setImgHistoryID("");
    setChatHistoryData([]);
    setImgHistoryData([]);
    setSettingModel(false);
    setChatTitle("Chat Title");
  };

  return (
    <div className="h-screen flex flex-col max-msm:bg-[#000]">
      <Header
        setUserActive={setUserActive}
        userActive={userActive}
        chatTitle={chatTitle}
        clickChat={clickChat}
        setClickChat={setClickChat}
        setMobileStatus={setMobileStatus}
        setChatTitle={setChatTitle}
      />
      <div className="flex flex-1 flex-row pb-2 overflow-auto">
        <HistorySider
          NewChat={NewChat}
          setChatHistoryID={setChatHistoryID}
          setImgHistoryID={setImgHistoryID}
          setChatStatus={setChatStatus}
          historySideData={historySideData}
          setHistorySideData={setHistorySideData}
          setChatTitle={setChatTitle}
          setChatHistoryData={setChatHistoryData}
          setImgHistoryData={setImgHistoryData}
          setMobileStatus={setMobileStatus}
          setClickChat={setClickChat}
          mobileStatus={mobileStatus}
          setImageModel={setImageModel}
          imageModel={imageModel}
        />
        {toggleStatus == 1 ? (
          <Chat
            chatHistroyID={chatHistroyID}
            historySideData={historySideData}
            setHistorySideData={setHistorySideData}
            setChatStatus={setChatStatus}
            setChatHistoryID={setChatHistoryID}
            chatStatus={chatStatus}
            chatHistroyData={chatHistroyData}
            setChatTitle={setChatTitle}
            chatTitle={chatTitle}
            mobileStatus={mobileStatus}
            imageModel={imageModel}
            imgHistoryID={imgHistoryID}
            setImgHistoryID={setImgHistoryID}
            imgHistoryData={imgHistoryData}
          />
        ) : (
          <Model_Interface />
        )}
      </div>
    </div>
  );
}
