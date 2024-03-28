"use client";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useModelStatus } from "../context/ModelStatusContext";
import Img_History from "@/components/img_history";
import Text_History from "../text_history";
import "react-contexify/ReactContexify.css";
import Image from "next/image";
import { Tabs, Tab, Tooltip, Select, SelectItem } from "@nextui-org/react";
import { Menu, Dropdown, ConfigProvider } from "antd";
import useAutosizeTextArea from "./useAutosizeTextArea";
import { apiURL } from "@/config";
import { Input } from "@nextui-org/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import PrivacyPolicyModal from "./privacyPolicyModal";
import CopyLink from "./CopyLink";

import DualListBox from "./List";

const textList = ["GPT-3.5", "GPT-4", "Gemini", "Perplexity", "Mistral"];
const imgList = ["DALL-E", "Stable Diffusion XL", "Stable Diffusion 2"];

const ratioList = [
  "1024x1024",
  "1152x896",
  "1216x832",
  "1344x768",
  "896x1152",
  "832x1216",
  "768x1344",
  "640x1536",
];

const Chat = ({
  chatStatus,
  chatHistoryID,
  setChatStatus,
  chatHistroyData,
  historySideData,
  setHistorySideData,
  setChatHistoryID,
  setChatTitle,
  chatTitle,
  mobileStatus,
  imageModel,
  imgHistoryID,
  setImgHistoryID,
  imgHistoryData,
  fullName,
  setFullName,
  setToggleStatus1,
}) => {
  const { textStatus, setTextStatus } = useModelStatus();
  const { toggleStatus, setToggleStatus } = useModelStatus();
  const { settingModel, setSettingModel } = useModelStatus();
  const { imgStatus, setImgStatus } = useModelStatus();
  const [loading, setLoading] = useState(false);
  const [ratioValue, setRatioValue] = useState("0");
  const [ratio, setRatio] = useState("");
  const [switchStatus, setSwitchStatus] = useState(false);
  const [selected, setSelected] = useState("GPT-3.5");
  const [imgSelected, setImgSelected] = useState("DALL-E");
  const [tabSelected, setTabSelected] = useState("");
  const [modelType, setModelType] = useState("");
  const [imgModelType, setImgModelType] = useState("");
  const [textModel, setTextModel] = useState(0);
  const [imageModelIndex, setImageModelIndex] = useState(0);
  const [type, setType] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [imgHistory, setImgHistory] = useState([]);
  const [blur, setBlur] = useState(false);
  const [value, setValue] = useState("");
  const [id, setID] = useState();
  const [showSearch, setShowSearch] = useState(false);
  const textAreaRef = useRef(null);
  const req_qa_box = useRef(null);
  const [inputPlaceholder, setInputPlaceholder] = useState("");

  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] =
    useState(false);
  const pinnedMessageRef = useRef(null);

  const [pinnedMessageMsgIndex, setPinnedMessageMsgIndex] = useState(0);
  const [pinnedMessageMsgType, setPinnedMessageMsgType] = useState("");
  const [pinnedMessageIndex, setPinnedMessageIndex] = useState(0);
  const [pinnedMessageText, setPinnedMessageText] = useState("");
  const [pinMessageVisible, setPinMessageVisible] = useState(false); // State to control visibility of pinned message
  const OnSetPinnedMessageMsgIndex = (index) => {
    setPinnedMessageMsgIndex(index);
  };
  const [textAnimationIndex, setTextAnimationIndex] = useState(-1);
  const [replyStatus1, setReplyStatus1] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyMsgIndex, setReplyMsgIndex] = useState(0);
  const [replyIndex, setReplyIndex] = useState(0);
  const [contextMenueStatus, setContextMenueStatus] = useState(false);
  const OnSetPinnedMessageMsgType = (value) => {
    setPinnedMessageMsgType(value);
  };

  const OnSetPinnedMessageIndex = (index) => {
    setPinnedMessageIndex(index);
  };

  const OnSetPinnedMessageText = (text) => {
    if (text !== null && text !== "") {
      setPinMessageVisible(true);
      setPinnedMessageText(text);
    } else {
      setPinMessageVisible(false);
      setPinnedMessageText(text);
    }
  };
  const handlePrivacyPolicyClick = () => {
    setIsPrivacyPolicyModalOpen(true);
  };

  const handlePinClose = () => {
    let data = JSON.stringify({
      id: chatHistoryID,
      index: pinnedMessageIndex,
      msgIndex: pinnedMessageMsgIndex,
    });
    let type = "ai";

    if (pinnedMessageMsgType == "image") {
      data = JSON.stringify({
        id: imgHistoryID,
        index: pinnedMessageIndex,
        msgIndex: pinnedMessageMsgIndex,
      });
      type = "img";
    }
    axios
      .post(`${apiURL}/${type}/unPinnedMessage`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          setPinMessageVisible(false);
        }
      });

    // Function to hide pinned message when close button is clicked
  };

  const changeModal = (number) => {
    console.log(number);

    if (imageModel == false) {
      setReplyStatus1(false);
      setTextModel(number);
      setSelected(textList[number]);
      setInputPlaceholder(`Message ${textList[number]}`);
    } else {
      setReplyStatus1(false);
      setImageModelIndex(number);
      setImgSelected(imgList[number]);
      setInputPlaceholder(`Message ${imgList[number]}`);
    }
  };

  const handleReplyClose = () => {
    setReplyStatus1(false);
    setReplyText("");
    setReplyIndex(0);
    setReplyMsgIndex(0);
  };

  const imageMenu = (
    <div className="mb-4">
      <Menu>
        <div className="mb-4">
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Specializes in creating unique, imaginative images from text
                  descriptions, showcasing creative and artistic abilities.
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(0)}
              >
                <Image
                  alt=""
                  width={24}
                  height={24}
                  src={"/models/dall-e.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  DALL - E
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  An advanced iteration known for its capability to handle
                  complex image generation tasks with high accuracy.
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(1)}
              >
                <Image
                  alt=""
                  width={24}
                  height={24}
                  src={"/models/s-diffu.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Stable Diffusion XL
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Enhanced from Stable Diffusion 2, this model excels in complex
                  image synthesis, with improved text encoding and training.{" "}
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(2)}
              >
                <Image alt="" width={24} height={24} src={"/models/s-xl.png"} />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Stable Diffusion 2
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
        </div>
      </Menu>
    </div>
  );

  const textMenu = (
    <div className="mb-4">
      <Menu>
        <div className="mb-4">
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  OpenAI’s top model, great with writing and math
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(1)}
              >
                <Image alt="" width={24} height={24} src={"/models/gpt4.png"} />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  ChatGPT - 4
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Googles top model, great with writing and math
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(2)}
              >
                <Image
                  alt=""
                  width={24}
                  height={24}
                  src={"/models/gemini.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Gemini
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Has access to the internet and is always up to date
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(3)}
              >
                <Image
                  alt=""
                  width={24}
                  height={24}
                  src={"/models/perplexity.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Perplexity
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Great for quick and concise answers
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(0)}
              >
                <Image alt="" width={24} height={24} src={"/models/gpt3.png"} />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  ChatGPT - 3.5
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Great for quick responses
                </div>
              }
              classNames={{
                content: ["mx-5 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(4)}
              >
                <Image
                  alt=""
                  width={24}
                  height={24}
                  src={"/models/mistral.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Mistral
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Auto selects the best model for you (coming soon!)
                </div>
              }
              classNames={{
                content: ["mx-5 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(Math.floor(Math.random() * 5))}
              >
                <Image alt="" width={24} height={24} src={"/models/auto.png"} />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Auto select
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
        </div>
      </Menu>
    </div>
  );

  useEffect(() => {
    setFullName(localStorage.getItem("fullname"));
    if (switchStatus == true) return;
    else req_qa_box.current.scrollTop = req_qa_box.current.scrollHeight;
  }, [chatHistory, switchStatus, imgHistory]);

  useEffect(() => {
    setModelType(selected);
    setInputPlaceholder(`Message ${selected}`);
  }, [selected]);

  useEffect(() => {
    setImgModelType(imgSelected);
    setInputPlaceholder(`Message ${imgSelected}`);
  }, [imgSelected]);

  useEffect(() => {
    setChatHistory(chatHistroyData);
  }, [chatHistroyData]);

  useEffect(() => {
    setImgHistory(imgHistoryData);
  }, [imgHistoryData]);

  // useEffect(() => {}, [imgModelType]);
  // useEffect(() => {
  //   setInputPlaceholder(`Message ${textModel}`);
  // }, [textModel]);

  useEffect(() => {
    if (imageModel == false) {
      if (chatHistoryID != "") {
        setID("");
        GetHistoryDataByID(chatHistoryID);
        setPinMessageVisible(false);
      }
      setInputPlaceholder(`Message ${textList[0]}`);
    } else {
      setPinMessageVisible(false);

      if (imgHistoryID != "") {
        setID("");
        GetHistoryDataByID(imgHistoryID);
      }
      setInputPlaceholder(`Message ${imgList[0]}`);
    }
    setReplyStatus1(false);
    setReplyText("");
    setReplyIndex(0);
    setReplyMsgIndex(0);
  }, [chatHistoryID, imgHistoryID, imageModel]);

  useAutosizeTextArea(textAreaRef.current, value);

  const GetHistoryDataByID = (id) => {
    setReplyStatus1(false);
    if (imageModel == false) {
      axios
        .get(`${apiURL}/ai/gethistoryByID/${id}`, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          let a = [];

          response.data.data.history.forEach((item, msgIndex) => {
            item.forEach((message, index) => {
              if (message.pinned) {
                setPinMessageVisible(true);
                setPinnedMessageMsgIndex(msgIndex);
                setPinnedMessageIndex(index);
                setPinnedMessageText(message.content);
              }
            });
          });
          setTextModel(textList.indexOf(response.data.data.type));
          setType(response.data.data.type);
          setInputPlaceholder(`Message ${response.data.data.type}`);
          setChatHistory(response.data.data.history);
          setTextAnimationIndex(-1);
        });
    } else {
      console.log("start img id data");
      axios
        .get(`${apiURL}/img/getImageDataByID/${id}`, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          response.data.data.history.forEach((item, msgIndex) => {
            item.forEach((message, index) => {
              if (message.pinned) {
                setPinMessageVisible(true);
                setPinnedMessageMsgIndex(msgIndex);
                setPinnedMessageIndex(index);
                setPinnedMessageText(message.content);
              }
            });
          });
          setImageModelIndex(imgList.indexOf(response.data.data.type));
          setImgSelected(imgList[imageModelIndex]);
          setInputPlaceholder(`Message ${response.data.data.type}`);
          setImgModelType(response.data.data.type);
          setImgHistory(response.data.data.history);
        });
    }
  };

  function removeTypeAndPinnedField(obj) {
    delete obj.type;
    delete obj.pinned;
    delete obj.reply;
    return obj;
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (imageModel == false) {
        if (value != "") TextGenerate();
        else return;
      } else {
        if (value != "") ImageGenerate();
        else return;
      }
    }
  };

  const handleChange = (event) => {
    const value = event.target?.value;
    setValue(value);
  };

  const apiMapping = {
    "GPT-4": "gpt4",
    "GPT-3.5": "gpt3",
    Gemini: "gemini",
    Mistral: "mistral",
    Perplexity: "perplexity",
  };

  const TextGenerate = () => {
    console.log("text generation start");
    setSwitchStatus(false);
    setChatStatus(true);
    let newHistory = [...chatHistory];
    if (replyStatus1 == true) {
      newHistory.push([
        { role: "user", content: value, reply: replyText },
        { role: "loading" },
      ]);
    } else {
      newHistory.push([{ role: "user", content: value }, { role: "loading" }]);
    }

    const loadingIndex = chatHistoryID == "" ? 0 : newHistory.length - 1;
    setTextAnimationIndex(loadingIndex);
    setChatHistory(newHistory);

    const handleResponse = (response, modelType, chatHistoryID) => {
      console.log("handle response", response);
      if (loadingIndex != -1) {
        const updatedItem = [...newHistory[loadingIndex]];
        updatedItem[1].role = "assistant";
        updatedItem[1].content = response.data.data;
        updatedItem[1].type = modelType;

        const updatedHistory = [...newHistory];
        updatedHistory[loadingIndex] = updatedItem;

        setChatHistory(updatedHistory);

        if (chatHistoryID == "") {
          setHistorySideData([
            {
              id: response.data.id,
              title: value,
              bot: response.data.data,
              date: response.data.date,
              thumbnail_url: response.data.thumbnail_url,
            },
            ...historySideData,
          ]);
        }
        setChatHistoryID(response.data.id);
      }
    };

    const requestData = {
      prompt: value,
      id: chatHistoryID,
      type: selected,
      userID: localStorage.getItem("userID"),
    };
    if (replyStatus1 == true) {
      requestData.reply = replyText;
    }
    console.log("requestData", requestData);

    if (chatHistoryID != "") {
      const pastHistory = [];
      chatHistory.forEach((innerArray) => {
        const newInnerArray = innerArray.map((item) => {
          const newItem = { ...item }; // Create a new object to avoid modifying the original item
          if (Array.isArray(newItem.content)) {
            newItem.content = newItem.content[newItem.content.length - 1]; // Get the last item from the array as a string
          }
          return removeTypeAndPinnedField(newItem);
        });
        pastHistory.push(newInnerArray);
      });

      requestData.pasthistory = pastHistory.flat();
    }

    setValue("");
    setBlur(false);
    if (replyStatus1 == true) {
      setReplyStatus1(false);
      setReplyMsgIndex(0);
      setReplyText("");
      setReplyIndex(0);
    }

    const apiName = apiMapping[selected];
    console.log("requestData: ", requestData);
    if (apiName) {
      axios
        .post(`${apiURL}/ai/${apiName}`, JSON.stringify(requestData), {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => handleResponse(response, selected, chatHistoryID))
        .catch((error) => console.error(error));
    }
  };

  const imgApiMapping = {
    "DALL-E": "dall",
    "Stable Diffusion XL": "diffu_xl",
    "Stable Diffusion 2": "diffu_two",
  };

  const ImageGenerate = () => {
    setSwitchStatus(false);
    setChatStatus(true);
    console.log("Image generation start", imgHistoryID);
    let newHistory = [...imgHistory];
    newHistory.push([{ role: "user", content: value }, { role: "loading" }]);
    setImgHistory(newHistory);
    const loadingIndex = newHistory.findIndex(
      (item) => item[1].role == "loading"
    );

    const handleResponse = (response, modelType, prompt) => {
      if (loadingIndex !== -1 && response.data) {
        const updatedItem = [...newHistory[loadingIndex]];
        updatedItem[1].role = "assistant";
        updatedItem[1].content = response.data.data;
        updatedItem[1].type = modelType;

        const updatedHistory = [...newHistory];
        updatedHistory[loadingIndex] = updatedItem;

        setImgHistory(updatedHistory);
        setImgHistoryID(response.data.id);

        if (imgHistoryID == "") {
          setHistorySideData([
            {
              id: response.data.id,
              title: prompt,
              date: response.data.date,
              thumbnail_url: response.data.thumbnail_url,
            },
            ...historySideData,
          ]);
        }
      }
    };

    const requestData = {
      prompt: value,
      type: imgHistoryID == "" ? imgSelected : imgModelType,
      id: imgHistoryID == "" ? "" : imgHistoryID,
      userID: localStorage.getItem("userID"),
      size: ratio,
    };

    if (imgHistoryID == "") {
      setChatTitle(value);
    }

    const apiUrl =
      imgHistoryID == ""
        ? `${apiURL}/img/${imgApiMapping[imgSelected]}`
        : `${apiURL}/img/${imgApiMapping[imgModelType]}`;

    setValue("");
    console.log("Sending api data: ", requestData);

    axios
      .post(apiUrl, JSON.stringify(requestData), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) =>
        handleResponse(response, requestData.type, requestData.prompt)
      )
      .catch((err) => {
        console.log(err);
      });
  };

  const clearHistory = () => {
    setChatHistory([]);
    // console.log(chatHistoryID);
    // let data = {
    //   id: chatHistoryID
    // };
    // axios
    //   .post(`${apiURL}/ai/clear`, data, {
    //     headers: { "Content-Type": "application/json" }
    //   })
    //   .then((response) => {
    //     setHistory([]);
    //   });
  };
  const clearInput = () => {
    setValue("");
  };

  const handleSelectionChange = (e) => {
    setRatioValue(e.target.value);
    setRatio(ratioList[e.target.value]);
  };

  const onClickPinnedMessage = (pinnedMessageIndex, pinnedMessageMsgIndex) => {
    if (pinnedMessageRef.current) {
      pinnedMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const OnCheckEditPinnedMessage = (msgIndex, Index, type, currentText) => {
    if (type == "text" && pinnedMessageMsgType == "text") {
      if (pinnedMessageMsgIndex >= msgIndex && pinnedMessageIndex > Index) {
        setPinMessageVisible(false);
        setPinnedMessageIndex(0);
        setPinnedMessageMsgIndex(0);
        setPinnedMessageMsgType(null);
        setPinnedMessageText("");
      } else if (
        pinnedMessageMsgIndex == msgIndex &&
        pinnedMessageIndex == Index
      ) {
        setPinnedMessageText(currentText);
      }
    } else {
      console.log("pinnedMessageMsgIndex", pinnedMessageMsgIndex);
      console.log("msgIndex", msgIndex);
      console.log("pinnedMessageIndex", pinnedMessageIndex);
      console.log("Index", Index);
      if (pinnedMessageMsgIndex >= msgIndex && pinnedMessageIndex == Index) {
        setPinMessageVisible(false);
        setPinnedMessageIndex(0);
        setPinnedMessageMsgIndex(0);
        setPinnedMessageMsgType(null);
        setPinnedMessageText("");
      } else if (
        pinnedMessageMsgIndex == msgIndex &&
        pinnedMessageIndex == Index
      ) {
        setPinnedMessageText(currentText);
      }
    }
  };

  const OnSetModalType = (type) => {
    setTextModel(textList.indexOf(type));
    setInputPlaceholder(`Message ${type}`);
    setSelected(type);
  };

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  const OnSetToggleStatus = (value) => {
    setToggleStatus1(value);
  };

  const OnSetReplyStatus = (status, index, msgIndex, text) => {
    if (status) {
      console.log("reply", status, index, msgIndex, text);
      setReplyStatus1(status);
      setReplyText(text);
      setReplyIndex(index);
      setReplyMsgIndex(msgIndex);
    }
  };

  const OnSetContextMenueStatus = (value) => {
    setContextMenueStatus(value);
  };

  return (
    <div
      className={`flex flex-1 flex-col pl-8 max-mlg:px-2 ${
        mobileStatus == true ? "" : "max-mlg:hidden"
      }`}
    >
      <div className="flex flex-col justify-between w-full">
        <div className="flex flex-row z-[1] max-msm:hidden w-xl max-mlg:w-mlg  gap-3 justify-between pl-2 rounded-3xl bg-[rgba(39,45,51,0.70)] shadow-[0_0px_1px_0px_rgba(0,0,0,0.25)] backdrop-blur-md">
          <p className="flex mt-3 font-nasalization text-[#FFF] max-w-[880px]">
            <div className="min-w-8 h-8 max-msm:w-12 max-msm:h-12 bg-[#2b2b2c] border border-[#484a4c] rounded-full flex flex-row items-center justify-center text-[#E9ECEF] text-[14px] font-nasalization font-medium leading-normal -mt-[4px] ml-[0px] mr-[8px] pt-[3px]">
              {chatTitle.slice(0, 1)}
            </div>
            {chatTitle.length < 30
              ? chatTitle.slice(0, 30)
              : chatTitle.slice(0, 30).concat("...")}
          </p>
          <div className="flex">
            <CopyLink />
            <div
              className="flex rounded-3xl p-4 bg-[#272D33] rounded-[24px] ml-[3px] cursor-pointer"
              onClick={handleShowSearch}
            >
              <Image alt="" width={18} height={18} src={"svg/search-new.svg"} />
            </div>
          </div>
        </div>
        {showSearch && (
          <div className="flex flex-row z-[1] max-msm:hidden w-xl max-mlg:w-mlg  gap-3 justify-between px-7 py-2">
            <div className="flex updown-arrow mt-[10px] gap-1">
              <ChevronUpIcon className="h-6 w-6 text-[#8c9aac] cursor-pointer" />
              <ChevronDownIcon className="h-6 w-6 text-[#8c9aac] cursor-pointer" />
            </div>

            <div className="flex px-3 input-search-bg rounded-3xl bg-[rgba(39,45,51,0.70)] shadow-[0_0px_1px_0px_rgba(0,0,0,0.25)] backdrop-blur-md w-full">
              <Image alt="" width={18} height={18} src={"svg/search-new.svg"} />
              <input
                type="text"
                placeholder="Search"
                className="text-[#FFF] text-[14px] w-full bg-transparent outline-none rounded font-normal leading-normal ml-1 bg-none min-h-[40px]"
              />

              <div className="scursor-pointer rounded-full w-[20px] h-[20px] bg-[#7c7c7c] pl-[5px] pt-[5px] mt-[9px]">
                <Image
                  alt=""
                  width={10}
                  height={10}
                  src={"svg/Icon-close.svg"}
                />
              </div>
            </div>
            <div
              className="search-close cursor-pointer mt-[13px]"
              onClick={handleShowSearch}
            >
              <Image alt="" width={18} height={18} src={"svg/Icon-close.svg"} />
            </div>
          </div>
        )}
        <div
          className={`flex flex-row justify-between items-center p-2 pl-6  max-msm:hidden w-xl max-mlg:w-mlg border-b border-gray-600 ${
            pinMessageVisible ? "" : "hidden"
          }`}
        >
          <p
            className="text-white font-semibold whitespace-normal"
            onClick={() =>
              onClickPinnedMessage(pinnedMessageIndex, pinnedMessageMsgIndex)
            }
          >
            <span className="truncate inline-block max-w-[650px]">
              <span className="text-[#0A84FF]">Pinned message:</span>{" "}
              {pinnedMessageText}
            </span>
          </p>

          <button className="text-white" onClick={() => handlePinClose()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 1a9 9 0 100 18 9 9 0 000-18zm4.95 5.05a.75.75 0 010 1.06L11.06 10l3.89 3.89a.75.75 0 11-1.06 1.06L10 11.06l-3.89 3.89a.75.75 0 01-1.06-1.06L8.94 10 5.05 6.11a.75.75 0 011.06-1.06L10 8.94l3.89-3.89a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col flex-1 overflow-y-auto w-full pt-[60px] max-msm:pt-5"
        ref={req_qa_box}
      >
        {blur ? (
          <div
            className={`z-10 fixed w-full h-[calc(100vh-140px)] backdrop-blur-[7px]`}
          ></div>
        ) : null}
        {chatStatus == true ? (
          imageModel == false ? (
            <div className="flex flex-col w-full max-w-[920px] mx-auto max-mxl:max-w-[900px] max-mlg:max-w-[800px] max-xl:max-w-[600px] max-msm:max-w-[360px] max-msm:mx-auto">
              {chatHistory.map((messages, msgIndex) => (
                <div key={msgIndex} className="message-group">
                  {messages.map((message, index) => (
                    <span key={`${msgIndex}-${index}`}
                      ref={
                        index === pinnedMessageIndex &&
                        msgIndex === pinnedMessageMsgIndex
                          ? pinnedMessageRef
                          : null
                      }
                    >
                      <Text_History
                        key={index}
                        msgIndex={msgIndex}
                        data={message}
                        chatHistory={chatHistory}
                        chatHistoryID={chatHistoryID}
                        id={id}
                        index={index}
                        loading={loading}
                        setChatHistory={setChatHistory}
                        setLoading={setLoading}
                        setSwitchStatus={setSwitchStatus}
                        setID={setID}
                        type={type}
                        setBlur={setBlur}
                        blur={blur}
                        setPinnedMessageText={OnSetPinnedMessageText}
                        setPinnedMessageIndex={OnSetPinnedMessageIndex}
                        setPinnedMessageMsgIndex={OnSetPinnedMessageMsgIndex}
                        setPinnedMessageMsgType={OnSetPinnedMessageMsgType}
                        checkEditPinnedMessage={OnCheckEditPinnedMessage}
                        setModelType={OnSetModalType}
                        setTextAnimationIndex={setTextAnimationIndex}
                        textAnimationIndex={textAnimationIndex}
                        setToggleStatus={OnSetToggleStatus}
                        setReplyStatus={OnSetReplyStatus}
                        setContextMenueStatus={OnSetContextMenueStatus}
                        contextMenueStatus={contextMenueStatus}
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full max-w-[920px] mx-auto max-mxl:max-w-[900px] max-mlg:max-w-[800px] max-xl:max-w-[600px] max-msm:max-w-[360px] max-msm:mx-auto">
              {imgHistory.map((data, msgIndex) => (
                <div key={msgIndex} className="message-group">
                  {data.map((image_data, index) => (
                    <span key={`${msgIndex}-${index}`}
                      ref={
                        index === pinnedMessageIndex &&
                        msgIndex === pinnedMessageMsgIndex
                          ? pinnedMessageRef
                          : null
                      }
                    >
                      <Img_History
                        key={index}
                        data={image_data}
                        msgIndex={msgIndex}
                        imgHistory={imgHistory}
                        imgHistoryID={imgHistoryID}
                        id={id}
                        index={index}
                        setTabSelected={setTabSelected}
                        loading={loading}
                        setImgHistory={setImgHistory}
                        setLoading={setLoading}
                        setSwitchStatus={setSwitchStatus}
                        setID={setID}
                        tabSelected={tabSelected}
                        ratio={ratio}
                        setPinnedMessageText={OnSetPinnedMessageText}
                        setPinnedMessageIndex={OnSetPinnedMessageIndex}
                        setPinnedMessageMsgIndex={OnSetPinnedMessageMsgIndex}
                        setPinnedMessageMsgType={OnSetPinnedMessageMsgType}
                        checkEditPinnedMessage={OnCheckEditPinnedMessage}
                        setToggleStatus={OnSetToggleStatus}
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )
        ) : (
          toggleStatus == 1 && (
            <>
              <div className="flex flex-col rounded-[20px] max-w-[860px] w-full mx-auto my-auto">
                <h2 className="bg-gradient-to-r from-[#7B88FF] via-[#7B88FF] to-[#64D0FF] inline-block text-transparent bg-clip-text text-[41.52px] font-normal leading-normal font-nasalization">
                  Hello, {fullName}{" "}
                </h2>
                {imageModel == false ? (
                  <>
                    <h2 className="text-[41.52px] font-normal leading-normal font-nasalization text-[#6B6B6B] mb-[30px]">
                      How can I help you today?
                    </h2>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                        &quot;Rewrite this paragraph to be more concise...&quot;
                      </div>
                      <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                      &quot;Summarize this article in 5 bullet points...&quot;
                      </div>
                      <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                        &quot;Based on this data, predict future trends in the
                        market.&quot;
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-[41.52px] font-normal leading-normal font-nasalization text-[#6B6B6B] mb-[30px]">
                      What image should I make?
                    </h2>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                        “Tarzan riding a lion”
                      </div>
                      <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                      &quot;Detailed oil painting of Muhammad Ali&quot;
                      </div>
                      <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                      &quot;Modern home in the hills of jungle&quot;
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-row mt-[30px] gap-2 justify-center">
                  <Image
                    alt=""
                    width={30}
                    height={30}
                    src={"/logo.png"}
                    className=""
                  />
                  <p className="text-[#D0D0D0] text-[19px] font-normal leading-normal font-nasalization">
                    Einstein
                    <span className="text-[19px] font-normal leading-normal font-helvetica ml-[8px]">
                      combines the best AI models available today. Watch the
                      video{" "}
                      <a href="" className="font-bold">
                        here
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </>
          )
        )}
      </div>
      <div
        className={`flex flex-col w-full max-w-[920px] mb-3 mx-auto items-center max-xl:pr-2 ${
          blur == true ? "z-[999]" : ""
        }`}
      >
        <div
          className={`flex flex-row w-full items-start mb-2 mt-3 gap-3 ${
            imageModel == false ? "hidden" : ""
          }`}
        >
          <p
            className={
              "ml-10 mt-[10px] font-nasalization text-sm font-normal text-[#FFF] leading-normal"
            }
          >
            Aspect Ratio
          </p>

          <DualListBox />
        </div>
        {replyStatus1 == true && (
          <div className="pl-[28px] min-w-[100%] flex flex-row w-full ">
            <div className="border border-[#085fb7] rounded-[12px] px-[20px] py-[22px] relative w-full">
              <span onClick={handleReplyClose}>
                <Image
                  className="absolute right-[10px] top-[10px]"
                  alt=""
                  width={12}
                  height={112}
                  src={"svg/close.svg"}
                />
              </span>

              <span className="text-[#8E8E8E] text-[12px] font-normal font-helvetica">
                Replying to:{" "}
              </span>
              <p className="text-[#fff] text-[14px] font-normal font-helvetica mt-[8px] border-l-1 border-[@fff] pl-[12px] py-[2px]">
                {replyText}
              </p>
            </div>
          </div>
        )}
        <div className="flex flx-row items-end gap-2 w-full max-msm:mb-3">
          <Tooltip
            content={<p className="text-[#FFF]">Erase Context</p>}
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
              width={20}
              height={20}
              src={"/svg/inputedit.svg"}
              onClick={() => clearInput()}
              className="cursor-pointer mb-3 max-lg:hidden"
            />
          </Tooltip>
          <div className="relative flex items-end gap-4 rounded-3xl border-[2px] bprder-solid border-[#0A84FF] w-full h-auto p-[2px]">
            {imageModel == false ? (
              <>
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgBase: "#181818",
                      borderRadius: 20,
                      colorBorder: "#313535",
                    },
                  }}
                >
                  <Dropdown
                    overlay={textMenu}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Image
                      alt=""
                      width={34}
                      height={34}
                      src={
                        textModel === 0
                          ? "/models/gpt3.png"
                          : textModel === 1
                          ? "/models/gpt4.png"
                          : textModel === 2
                          ? "/models/gemini.png"
                          : textModel === 3
                          ? "/models/perplexity.png"
                          : textModel === 4
                          ? "/models/mistral.png"
                          : ""
                      }
                      className="mb-[2px] ml-1"
                    />
                  </Dropdown>
                </ConfigProvider>
              </>
            ) : (
              <ConfigProvider
                theme={{
                  token: {
                    colorBgBase: "#181818",
                    borderRadius: 20,
                    colorBorder: "#313535",
                  },
                }}
              >
                <Dropdown
                  overlay={imageMenu}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Image
                    alt=""
                    width={34}
                    height={34}
                    src={
                      imageModelIndex === 0
                        ? "/models/dall-e.png"
                        : imageModelIndex === 1
                        ? "/models/s-diffu.png"
                        : imageModelIndex === 2
                        ? "/models/s-xl.png"
                        : ""
                    }
                    className="mb-[2px] ml-1"
                  />
                </Dropdown>
              </ConfigProvider>
            )}

            <Image
              alt=""
              width={11}
              height={20}
              src={"svg/attach.svg"}
              className={`ml-1 max-h-10 mb-2`}
            />

            <textarea
              id="review-text"
              onChange={handleChange}
              value={value}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder={blur ? "Reply" : inputPlaceholder}
              ref={textAreaRef}
              rows={1}
              cols={0}
              className="text-[#D0D0D0] resize-none max-h-[230px] overflow-y-auto justify-items-center py-[6px] text-lg helvetica-font w-full bg-transparent outline-none rounded font-normal leading-normal ml-1"
            />
            <div
              className={`flex flex-row max-h-10 justify-center ${
                value == "" ? "mr-3 mb-3" : "rounded-full bg-[#0A84FF] p-3"
              }`}
            >
              <Image
                alt=""
                width={17}
                height={18}
                src={"/svg/send.svg"}
                className="cursor-pointer"
                onClick={
                  imageModel == false
                    ? () => TextGenerate()
                    : () => ImageGenerate()
                }
              />
            </div>
          </div>
        </div>
        <div className="max-msm:hidden text-[#929292] text-[10.7px] font-normal font-Inter leading-normal mt-2">
          Einstein may display inaccurate or dangerous information, please use
          responsibly.{" "}
          <a
            href="#"
            onClick={handlePrivacyPolicyClick}
            style={{ textDecoration: "underline" }}
          >
            Your privacy & Einstein Apps
          </a>
        </div>

        {/* Privacy Policy Modal */}
        {isPrivacyPolicyModalOpen && (
          <PrivacyPolicyModal
            setIsPrivacyPolicyModalOpen={setIsPrivacyPolicyModalOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;