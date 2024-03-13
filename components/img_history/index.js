"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useModelStatus } from "../context/ModelStatusContext";
import {
  Tabs,
  Tab,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { apiURL } from "@/config";
import ReactMarkDown from "../Markdown";

const Img_History = ({
  data,
  imgHistory,
  imgHistoryID,
  id,
  index,
  setTabSelected,
  loading,
  setImgHistory,
  setLoading,
  setSwitchStatus,
  setID,
  tabSelected,
  ratio,
}) => {
  const { imgStatus, setImgStatus } = useModelStatus();
  const [imageList, setImageList] = useState([
    "DALL-E",
    "Stable Diffusion XL",
    "Stable Diffusion 2",
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [heart, setHeart] = useState(false);
  const [upScale, setUpScale] = useState(false);
  const [number, setNumber] = useState();
  const [editingMessage, setEditingMessage] = useState("");
  const [editModeIndex, setEditModeIndex] = useState(-1);
  const textareaRef = useRef(null);

  const enterEditMode = (message) => {
    setEditingMessage(message);
  };

  const handleEditChange = (e) => {
    setEditingMessage(e.target.value);
    autoResizeTextarea(e.target);
  };

  const autoResizeTextarea = (element) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
    element.style.width = "auto";
    element.style.width = element.scrollWidth + "px";
  };

  // Function to cancel edit
  const cancelEdit = () => {
    // Reset edit mode index to -1 to exit edit mode
    setEditModeIndex(-1);
  };

  const submitEdit = (index, model_type) => {
    console.log("Index: ", index);
    console.log("model_type: ", model_type);
    console.log("Submit Edit CLicked! now call api!");
    console.log("data: ", data);
    console.log("tabSelected: ", imgHistory);
    console.log("imgHistoryID: ", imgHistoryID);
    console.log("id: ", id);

    const updatedChatHistory = [...imgHistory];
    updatedChatHistory[index].content = editingMessage;
    updatedChatHistory.splice(index + 1); // Remove messages after the edited message

    let pasthistory = [];
    updatedChatHistory.map((item, index) => {
      let data = item;
      pasthistory.push(data);
    });

    let sumData = {
      type: model_type,
      id: imgHistoryID,
      history: pasthistory,
      prompt: editingMessage,
      number: (index - 1) / 2,
      size: ratio,
      userID: localStorage.getItem("userID"),
    };

    updatedChatHistory.push({ role: "loading" });
    setImgHistory(updatedChatHistory);
    console.log("sumData: ", sumData);
    // Mocking API call, replace it with your actual API call
    setTimeout(() => {
      axios
        .post(`${apiURL}/img/edit`, sumData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log("response: ", response);
          let a = [...pasthistory];
          a.push(response.data);
          setLoading(false);
          setImgHistory(a);
        });
    }, 2000); // Mock API response time (2 seconds)
  };

  const handleLoading = () => {
    // Handling loading state
    setLoading(true);
    setEditModeIndex(-1); // Reset edit mode index
    setEditingMessage(""); // Reset editing message
  };

  useEffect(() => {
    // Adjust initial width and height based on content
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, []);

  const download = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "image.jpg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Summarize = (data, id) => {
    console.log("Sending data: ", data);
    axios
      .post(`${apiURL}/img/summarize`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        let a = [...imgHistory];
        a[id]["content"] = response.data.data;
        console.log(a);
        setLoading(false);
        setImgHistory(a);
      });
  };

  const getDataByType = (id, i) => {
    axios
      .get(`${apiURL}/img/getImageDataByID/${id}`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        let a = [...imgHistory];
        let b = [];
        response.data.data.history[(i - 1) / 2].map((item, index) => {
          if (item.type == tabSelected) b.push(item);
        });
        a[i] = b[0];
        setLoading(false);
        setImgHistory(a);
      });
  };

  const handleOpen = (i) => {
    onOpen();
    setID(i);
  };

  const heartFunc = () => {
    if (heart == false) setHeart(true);
    else setHeart(false);
  };

  return (
    <div key={index} className="flex flex-col w-full">
      {data.role === "user" ? (
        <div className={`flex justify-end w-full mb-4 pr-5 max-mxl:pr-0`}>
          {editModeIndex === index ? (
            <div className="flex flex-col mt-4">
              <textarea
                value={editingMessage}
                onChange={handleEditChange}
                className="px-3 py-2 border border-white rounded-md w-auto focus:outline-none focus:ring focus:border-blue-300 resize-none text-white bg-transparent"
                style={{
                  minWidth: "600px",
                  maxWidth: "100%",
                  minHeight: "100px",
                }}
                ref={textareaRef}
              />
              <div className="mt-3">
                <div className="flex  justify-end items-center">
                  <button
                    className="px-2 py-1 whitespace-nowrap rounded-md bg-blue-500 hover:bg-blue-700 text-white mr-2"
                    onClick={() => {
                      handleLoading(); // Call handleLoading to handle loading state
                      let model_type =
                        index + 1 < imgHistory.length &&
                        imgHistory[index + 1].type !== undefined
                          ? imgHistory[index + 1].type
                          : "DALL-E";
                      submitEdit(index, model_type);
                    }}
                  >
                    Submit & Save
                  </button>
                  <button
                    className="px-2 py-1 text-white rounded-md border border-indigo-400 border-solid text-center"
                    onClick={() => cancelEdit(index)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap flex-row mt-4">
              <Tooltip
                content={<p className="text-[#FFF]">Edit</p>}
                showArrow
                placement="bottom"
                delay={0}
                closeDelay={0}
                classNames={{
                  base: ["before:bg-[##2E353C]"],
                  content: [
                    "bg-[#2E353C] text-sm font-normal leading-4 px-3 py-2",
                  ],
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
                <div className="flex items-center">
                  <Image
                    alt=""
                    width={16}
                    height={21}
                    onClick={() => {
                      enterEditMode(data.content);
                      setEditModeIndex(index);
                    }}
                    src={"svg/edit.svg"}
                    className="cursor-pointer"
                    style={{ marginRight: "8px" }}
                  />
                </div>
              </Tooltip>
              <div className="max-w-[650px] max-xl:max-w-[400px] max-msm:max-w-[250px] break-words text-[20px] text-[#FFF] font-helvetica font-normal leading-8 bg-[#0A84FF] rounded-[20px] py-3 px-5">
                <ReactMarkDown data={data.content} />
              </div>
            </div>
          )}
        </div>
      ) : null}

      {data.role == "loading" ? (
        <div className="flex flex-row justify-center mb-2">
          <div className="w-[100px] bg-[#23272B] rounded-[20px] mt-4">
            <div className="snippet" data-title="dot-pulse">
              <div className="stage">
                <div className="dot-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {data.role != "assistant" ? null : (
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-2 mb-2">
            <div className="flex flex-wrap gap-0 p-0 mt-6">
              <Tabs
                size="sm"
                radius="lg"
                variant="light"
                selectedKey={id == index ? tabSelected : data.type}
                onSelectionChange={setTabSelected}
                onClick={(e) => {
                  setUpScale(false);
                  let sumData = {
                    new_type: e.target.outerText,
                    id: imgHistoryID,
                    prompt: imgHistory[index - 1].content,
                    number: (index - 1) / 2,
                    userID: localStorage.getItem("userID"),
                    size: ratio,
                  };
                  console.log(imgHistory);
                  setSwitchStatus(true);
                  setLoading(true);
                  setID(index);
                  let x = {
                    id: (index - 1) / 2,
                    historyID: imgHistoryID,
                  };
                  console.log("Sending this data: ", x);
                  console.log("Tab selected: ", tabSelected);
                  axios
                    .post(`${apiURL}/img/getType/`, x, {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    })
                    .then((response) => {
                      console.log(response.data);
                      console.log("Output", response.data.data, tabSelected);
                      console.log(
                        "index;",
                        response.data.data.indexOf(tabSelected)
                      );
                      if (response.data.data.indexOf(tabSelected) == -1) {
                        console.log("sumData:", sumData);
                        console.log("index:", index);

                        Summarize(sumData, index);
                      } else getDataByType(imgHistoryID, index);
                    });
                }}
                classNames={{
                  tabList: "w-full relative border-divider p-0 gap-0",
                  cursor: "w-full bg-[#2E353C] p-0",
                  tabContent:
                    "group-data-[selected=true]:text-[#FFF] p-0 font-nasalization",
                  panel: "text-[100px]",
                }}
                aria-label="Tabs variants"
              >
                {imgStatus.map(
                  (item, index) =>
                    item && (
                      <Tab
                        key={imageList[index]}
                        title={<p>{imageList[index]}</p>}
                      />
                    )
                )}
              </Tabs>
            </div>
            <div
              className="flex flex-wrap mt-6 cursor-pointer"
              onClick={() => {
                setToggleStatus(0);
                setSettingModel(true);
              }}
            >
              <Tooltip
                content={
                  <div>
                    <p className="text-[#FFF]">
                      Add more{" "}
                      <Link href="" className="text-[#0A84FF]">
                        models
                      </Link>
                    </p>
                  </div>
                }
                showArrow
                placement="top"
                delay={0}
                closeDelay={0}
                classNames={{
                  base: ["before:bg-[##2E353C]"],
                  content: [
                    "bg-[#2E353C] text-sm font-normal leading-4 px-3 py-2",
                  ],
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
                  width={16}
                  height={16}
                  src={"svg/modelplus.svg"}
                />
              </Tooltip>
            </div>
          </div>
          {loading == true && id == index ? (
            <div className="flex flex-row w-full justify-center mb-2">
              <div className="w-[100px] bg-[#23272B] rounded-[20px] mt-4">
                <div className="snippet" data-title="dot-pulse">
                  <div className="stage">
                    <div className="dot-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`grid ${
                upScale == true ? "grid-cols-1" : "grid-cols-2"
              } gap-1 max-w-[720px] mb-2 w-full`}
            >
              {data.content.map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleOpen(index)}
                  className={`${upScale == true ? "hidden" : ""}`}
                >
                  <Image
                    alt=""
                    width={360}
                    height={256}
                    src={item.url}
                    className={`${
                      data.size == "1024x1024"
                        ? "aspect-1/1"
                        : data.size == "1152x896"
                        ? "aspect-9/7"
                        : data.size == "1216x832"
                        ? "aspect-19/13"
                        : data.size == "1344x768"
                        ? "aspect-7/4"
                        : data.size == "896x1152"
                        ? "aspect-7/9"
                        : data.size == "832x1216"
                        ? "aspect-13/19"
                        : data.size == "768x1344"
                        ? "aspect-4/7"
                        : data.size == "640x1536"
                        ? "aspect-5/12"
                        : "aspect-1/1"
                    }`}
                  />
                </div>
              ))}
              {upScale == true ? (
                <Image
                  alt=""
                  width={720}
                  height={256}
                  src={data.content[number].url}
                  onClick={() => handleOpen(index)}
                  className={`${
                    data.size == "1024x1024"
                      ? "aspect-1/1"
                      : data.size == "1152x896"
                      ? "aspect-9/7"
                      : data.size == "1216x832"
                      ? "aspect-19/13"
                      : data.size == "1344x768"
                      ? "aspect-7/4"
                      : data.size == "896x1152"
                      ? "aspect-7/9"
                      : data.size == "832x1216"
                      ? "aspect-13/19"
                      : data.size == "768x1344"
                      ? "aspect-4/7"
                      : data.size == "640x1536"
                      ? "aspect-5/12"
                      : "aspect-1/1"
                  }`}
                />
              ) : null}

              <Modal
                size="full"
                isOpen={isOpen}
                onClose={onClose}
                hideCloseButton
                className="bg-[#181818] z-[999] overflow-auto"
                classNames={{
                  backdrop:
                    "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col justify-end items-end gap-1 z-[999]">
                        <div className="flex flex-row gap-6 z-[999]">
                          <Image
                            alt=""
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            src={`${
                              heart == false
                                ? "/svg/heart.svg"
                                : "/svg/heart_active.svg"
                            }`}
                            onClick={() => heartFunc()}
                          />
                          <Image
                            alt=""
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            src={"/svg/external.svg"}
                          />
                          <Image
                            alt=""
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            src={"/svg/download.svg"}
                            onClick={() =>
                              download(imgHistory[id].content[number].url)
                            }
                          />
                          <Image
                            alt=""
                            width={18}
                            height={18}
                            onClick={() => onClose()}
                            className="cursor-pointer"
                            src={"/svg/close.svg"}
                          />
                        </div>
                      </ModalHeader>
                      <ModalBody>
                        {upScale == false ? (
                          <div className="grid grid-cols-2 max-w-[1000px] mx-auto my-auto gap-1 w-full">
                            {imgHistory[id].content.map((item, i) => (
                              <Image
                                key={i}
                                alt=""
                                width={500}
                                height={180}
                                className={`${
                                  data.size == "1024x1024"
                                    ? "aspect-1/1"
                                    : data.size == "1152x896"
                                    ? "aspect-9/7"
                                    : data.size == "1216x832"
                                    ? "aspect-19/13"
                                    : data.size == "1344x768"
                                    ? "aspect-7/4"
                                    : data.size == "896x1152"
                                    ? "aspect-7/9"
                                    : data.size == "832x1216"
                                    ? "aspect-13/19"
                                    : data.size == "768x1344"
                                    ? "aspect-4/7"
                                    : data.size == "640x1536"
                                    ? "aspect-5/12"
                                    : "aspect-1/1"
                                }`}
                                src={item.url}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 max-w-[800px] mx-auto my-auto gap-1 w-full">
                            <Image
                              alt=""
                              width={800}
                              height={180}
                              className={`${
                                data.size == "1024x1024"
                                  ? "aspect-1/1"
                                  : data.size == "1152x896"
                                  ? "aspect-9/7"
                                  : data.size == "1216x832"
                                  ? "aspect-19/13"
                                  : data.size == "1344x768"
                                  ? "aspect-7/4"
                                  : data.size == "896x1152"
                                  ? "aspect-7/9"
                                  : data.size == "832x1216"
                                  ? "aspect-13/19"
                                  : data.size == "768x1344"
                                  ? "aspect-4/7"
                                  : data.size == "640x1536"
                                  ? "aspect-5/12"
                                  : "aspect-1/1"
                              }`}
                              src={imgHistory[id].content[number].url}
                            />
                          </div>
                        )}
                      </ModalBody>
                      <ModalFooter></ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          )}
          <div className="flex flex-row gap-11 font-base font-helvetica font-medium leading-normal ml-3">
            <p
              className="text-[#FFF] cursor-pointer"
              onClick={() => {
                setNumber(0);
                setUpScale(true);
              }}
            >
              U1
            </p>
            <p
              className="text-[#FFF] cursor-pointer"
              onClick={() => {
                setNumber(1);
                setUpScale(true);
              }}
            >
              U2
            </p>
            <p
              className="text-[#FFF] cursor-pointer"
              onClick={() => {
                setNumber(2);
                setUpScale(true);
              }}
            >
              U3
            </p>
            <p
              className="text-[#FFF] cursor-pointer"
              onClick={() => {
                setNumber(3);
                setUpScale(true);
              }}
            >
              U4
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Img_History;
