import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useModelStatus } from "../context/ModelStatusContext";
import Image from "next/image";
import Link from "next/link";
import { Tabs, Tab, Tooltip } from "@nextui-org/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkDown from "../Markdown";
import { apiURL } from "@/config";
import { useDisclosure } from "@nextui-org/react";
import { Typewriter } from "../chat/typeWriter";

const Text_History = ({
  data,
  chatHistory,
  chatHistoryID,
  id,
  msgIndex,
  index,
  loading,
  setChatHistory,
  setLoading,
  setSwitchStatus,
  setID,
  type,
  setBlur,
  blur,
  setPinnedMessageText,
  setPinnedMessageIndex,
  setPinnedMessageMsgIndex,
  setPinnedMessageMsgType,
  checkEditPinnedMessage,
  setModelType,
  setTextAnimationIndex,
  textAnimationIndex,
  setToggleStatus,

  setReplyStatus,
}) => {
  const [tabSelected, setTabSelected] = useState(data.type);
  const [copyStatus, setCopyStatus] = useState(false);
  const { textStatus, setTextStatus } = useModelStatus();
  const [vote, setVote] = useState(false);
  const [deVote, setDeVote] = useState(false);
  const [modelList, setModelList] = useState([
    "GPT-3.5",
    "GPT-4",
    "Gemini",
    "Perplexity",
    "Mistral",
  ]);
  const [tooltipModelList, setTooltipModelList] = useState([
    "GPT-3.5",
    "GPT-4",
    "Gemini",
    "Perplexity",
    "Mistral",
  ]);

  const [editingMessage, setEditingMessage] = useState("");
  const [editModeIndex, setEditModeIndex] = useState(-1);
  const textareaRef = useRef(null);
  const [contextMenuPosition, setContextMenuPosition] = useState(null); // State to store context menu position
  const [contextedMenuPinnedStatus, setContextedMenuPinnedStatus] =
    useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contextedMenuIndex, setContextedMenuIndex] = useState();
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [totalMsg, setTotalMsg] = useState(0);
  const [currentMsg, setCurrentMsg] = useState("");

  // Function to handle right-click on user messages
  const handleContextMenu = (e, index, pinned = false) => {
    e.preventDefault();

    if (e.type === "contextmenu" && e.clientX !== 0 && e.clientY !== 0) {
      // Only set context menu position on right-click

      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setContextedMenuIndex(index);

      setContextedMenuPinnedStatus(pinned);
    }
  };

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

  const submitEdit = (index, msgIndex) => {
    console.log("Submit Edit Clicked! Now call API!");
    const updatedChatHistory = [...chatHistory];
    updatedChatHistory[msgIndex][index].content = editingMessage;

    const modelType = updatedChatHistory[msgIndex][1].type;
    setModelType(modelType);
    console.log("Editing message for model: ", modelType);

    updatedChatHistory[msgIndex].splice(index + 1);
    updatedChatHistory.splice(msgIndex + 1);

    const pastHistory = updatedChatHistory.map((item) => [...item]);

    const sumData = {
      type: modelType,
      history: pastHistory,
      id: chatHistoryID,
      number: (index - 1) / 2,
      userID: localStorage.getItem("userID"),
    };

    updatedChatHistory[msgIndex].push({ role: "loading" });
    setChatHistory(updatedChatHistory);
    checkEditPinnedMessage(msgIndex, index, "text", editingMessage);

    axios
      .post(`${apiURL}/ai/edit`, JSON.stringify(sumData), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoading(false);
        setChatHistory(response.data.data);
        setTextAnimationIndex(msgIndex);
      })
      .catch((error) => console.error(error));
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

  const Regenerate = (i, chatHistoryID, typeOfModel) => {
    setLoading(true);
    setID(i);
    let pasthistory = [];
    chatHistory.slice(0, i + 1).map((item) => {
      let data = item.slice(0, -1); // Remove the last element of the array
      pasthistory.push(data);
    });
    console.log("typeOfModel", typeOfModel);

    let data = {
      historyData: pasthistory,
      type: typeOfModel,
      index: i,
      id: chatHistoryID,
    };
    console.log("regenrate data", data);
    chatHistory[msgIndex][1]["role"] = "loading";
    setChatHistory(chatHistory);

    axios
      .post(`${apiURL}/ai/regenerate`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data.data);
        let a = [...chatHistory];
        const chat_content = response.data.data;
        setCurrentMsgIndex(chat_content.length - 1);
        setTotalMsg(chat_content.length);
        setCurrentMsg(chat_content[chat_content.length - 1]);
        a[msgIndex][1]["content"] = response.data.data;
        a[msgIndex][1]["role"] = "assistant";
        a[msgIndex][1]["type"] = typeOfModel;
        setLoading(false);
        setTextAnimationIndex(msgIndex);
        setChatHistory(a);
        setModelType(chatHistory[i][1].type);
      });
  };

  const replyFunction = (index, text) => {
    // setBlur(true);
    setID(index);

    setReplyStatus(true, index, msgIndex, text);
  };

  const onCancel = () => {
    setBlur(false);
  };

  const onSetPinnedMessageIndex = (msgIndex, index) => {
    setPinnedMessageMsgIndex(msgIndex);
    setPinnedMessageIndex(index);
    setPinnedMessageText(chatHistory[msgIndex][index].content);
    setPinnedMessageMsgType("text");
    const updatedChatHistory = chatHistory.map((msg, i) => {
      return msg.map((item, j) => ({
        ...item,
        pinned: j === index && i === msgIndex ? true : false,
      }));

      return msg;
    });

    setChatHistory(updatedChatHistory);
  };

  const onSetUnpinnedMessageIndex = (msgIndex, index) => {
    setPinnedMessageMsgIndex(0);
    setPinnedMessageIndex(0);
    setPinnedMessageText("");
    setPinnedMessageMsgType("");
    const updatedChatHistory = [...chatHistory];
    delete updatedChatHistory[msgIndex][index].pinned;
    setChatHistory(updatedChatHistory);
  };

  const onChangeTabSelected = (outerText, chatHistoryID) => {
    setTabSelected(outerText);
    const pastHistory = chatHistory
      .slice(0, msgIndex + 1)
      .flatMap((item) => item.slice(0, -1));

    let sumData = {
      old_type: chatHistory[msgIndex][1]["type"],
      new_type: outerText,
      history: pastHistory,
      id: chatHistoryID,
      number: msgIndex,
      userID: localStorage.getItem("userID"),
    };
    console.log("sumData:", sumData);
    setSwitchStatus(true);
    setID(chatHistoryID);
    setModelType(outerText);
    Summarize(sumData, msgIndex, index);
  };

  const [selectedText, setSelectedText] = useState("");
  const [showReplyIcon, setShowReplyIcon] = useState(false);
  const [selectionCoordinates, setSelectionCoordinates] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    document.addEventListener("mouseup", handleOutsideClick);

    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
    };
  }, []);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText !== "") {
      setSelectedText(selectedText);
      setShowReplyIcon(true);
      const selectionRange = selection.getRangeAt(0);
      const rect = selectionRange.getBoundingClientRect();
      const parentRect =
        selection.anchorNode.parentElement.getBoundingClientRect();
      setSelectionCoordinates({
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top,
      });
    } else {
      setShowReplyIcon(false);
    }
  };

  const handleReplyIconClick = () => {
    const textarea = document.getElementById("review-textaad");
    textarea.value = ""; // Clear existing text
    const newText = selectedText;
    textarea.value = newText;
    setShowReplyIcon(false);
    setSelectedText("");
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".text-container")) {
      setShowReplyIcon(false);
    }
  };

  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const Summarize = (data, msgIndex, index) => {
    const updatedChatHistory = [...chatHistory];
    updatedChatHistory[msgIndex][index]["role"] = "loading";
    setChatHistory(updatedChatHistory);
    setLoading(true);

    axios
      .post(`${apiURL}/ai/summarize`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        updatedChatHistory[msgIndex][index]["content"] = response.data.data;
        updatedChatHistory[msgIndex][index]["type"] = data.new_type;
        updatedChatHistory[msgIndex][index]["role"] = "assistant";

        setLoading(false);
        setTextAnimationIndex(msgIndex);
        setChatHistory(updatedChatHistory);
      })
      .catch((error) => {
        console.error("Error in summarization:", error);
      });
  };

  function handleTypingEnd() {
    // Reset textAnimationIndex when typing ends
    setTextAnimationIndex(-1);
    setCurrentMsg(data.content);
  }

  useEffect(() => {
    // Adjust initial width and height based on content
    if (Array.isArray(data.content) && data.content.length > 0) {
      setCurrentMsgIndex(data.content.length - 1);
      setTotalMsg(data.content.length);
      setCurrentMsg(data.content[data.content.length - 1]);
    } else {
      setCurrentMsg(data.content);
    }
  }, [data]);

  const handleLeftClick = () => {
    if (currentMsgIndex > 0) {
      setCurrentMsgIndex(currentMsgIndex - 1);
      setCurrentMsg(data.content[currentMsgIndex - 1]);
    }
  };
  const handleRightClick = () => {
    if (currentMsgIndex < totalMsg - 1) {
      setCurrentMsgIndex(currentMsgIndex + 1);
      setCurrentMsg(data.content[currentMsgIndex + 1]);
    }
  };

  const handleToggleStatus = () => {
    setToggleStatus(0);
  };
  return (
    <div key={index} className="flex flex-col w-full">
      {/* user compannent */}
      {data.role === "user" ? (
        <div className={`flex justify-end w-full mb-0 pr-5 max-mxl:pr-0`}>
          {editModeIndex === index ? (
            <div className="flex flex-col mt-4">
              <textarea
                value={editingMessage}
                onChange={handleEditChange}
                className="px-7 py-4 border border-[#0a83ff] rounded-[32px] w-auto focus:outline-none focus:ring focus:border-[#0a83ff] resize-none  bg-transparent text-lg max-msm:text-[15px] text-[#FFF] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]"
                style={{
                  minWidth: "600px",
                  maxWidth: "100%",
                  // minHeight: "100px",
                }}
                ref={textareaRef}
              />
              <div className="mt-3">
                <div className="flex  justify-end items-center">
                  <button
                    className="px-6 py-1.5 whitespace-nowrap rounded-md bg-[#0a83ff] hover:bg-blue-700 text-white mr-2 font-helvetica font-bold text-[16px]"
                    onClick={() => {
                      handleLoading(); // Call handleLoading to handle loading state
                      submitEdit(index, msgIndex);
                    }}
                  >
                    Save & Submit
                  </button>
                  <button
                    className="px-7 py-1 text-white rounded-md border border-[#4e91c1] text-center text-[#a1a1a1] font-helvetica font-normal h-[36px] pt-[6px]"
                    onClick={() => cancelEdit(index)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-wrap flex-row mt-4"
              onContextMenu={(e) => handleContextMenu(e, index, data.pinned)}
            >
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
                />
              </Tooltip>
              <div className="max-w-[650px] max-xl:max-w-[400px] max-msm:max-w-[250px] break-words text-[20px] text-[#FFF] font-helvetica font-normal leading-8 bg-[#0A84FF] rounded-[20px] py-3 px-5 ml-2">
                {data.reply && (
                  <div className=" min-w-[100%] flex flex-row w-full ">
                    <div className=" relative w-full">
                      <span className="text-[#fff] text-[12px] font-normal font-helvetica">
                        Replying to:{" "}
                      </span>
                      <p className="text-[#fff] text-[14px] font-normal font-helvetica mt-[8px] border-l-1 border-[@fff] pl-[12px] py-[2px]">
                        {data.reply}
                      </p>
                    </div>
                  </div>
                )}
                <ReactMarkDown data={data.content} />
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* popup menue */}
      {contextMenuPosition && (
        <ContextMenu
          position={contextMenuPosition}
          onClose={() => setContextMenuPosition(null)}
          index={index}
          chatHistoryID={chatHistoryID}
          msgIndex={msgIndex}
          setPinnedMessageIndex={onSetPinnedMessageIndex}
          setUnpinnedMessageIndex={onSetUnpinnedMessageIndex}
          contextedMenuPinnedStatus={contextedMenuPinnedStatus}
          // Add any necessary props or actions for the context menu component
        />
      )}

      {/* loader */}
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

      {/* assistant chat */}
      {data.role != "assistant" ? null : (
        <div
          className={`flex flex-col w-full items-start ${
            blur && index == id ? "z-[999]" : null
          }`}
        >
          <div className="flex flex-row gap-2">
            <div className="flex flex-wrap gap-0 p-0 mt-6">
              <Tabs
                size="sm"
                radius="lg"
                variant="light"
                selectedKey={id == index ? tabSelected : data.type}
                onSelectionChange={setTabSelected}
                onClick={(e) =>
                  onChangeTabSelected(e.target.outerText, chatHistoryID)
                }
                classNames={{
                  tabList: "w-full relative border-divider p-0 gap-0",
                  cursor: "w-full bg-[#2E353C] p-0",
                  tabContent:
                    "group-data-[selected=true]:text-[#FFF] p-0 font-nasalization",
                  panel: "text-[100px]",
                }}
                aria-label="Tabs variants"
              >
                {textStatus.map(
                  (item, index) =>
                    item && (
                      <Tab
                        key={modelList[index]}
                        title={<p>{modelList[index]}</p>}
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
                      <Link
                        href=""
                        onClick={handleToggleStatus}
                        className="text-[#0A84FF]"
                      >
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
            <div
              className={`flex flex-col w-full items-start ${
                blur && index == id ? "z-[999]" : null
              }`}
            >
              <div className="flex flex-row mb-10">
                <div className="w-[100px]  mt-4">
                  <div className="snippet" data-title="dot-pulse">
                    <div className="stage">
                      <div className="single-dot-loader"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col max-w-max mr-[138px] max-mxl:mr-[220px] max-xl:mr-[100px] max-msm:mr-12 mb-4">
              {Array.isArray(data.content) ? (
                <div
                  className={`mt-4 bg-[#23272B] max-w-max rounded-[20px] py-3 px-6`}
                  onContextMenu={(e) =>
                    handleContextMenu(e, index, data.pinned)
                  }
                >
                  {textAnimationIndex == msgIndex ? (
                    <Typewriter
                      text={currentMsg}
                      delay={15}
                      onTypingEnd={handleTypingEnd}
                    />
                  ) : (
                    <ReactMarkDown data={currentMsg} />
                  )}
                </div>
              ) : (
                <div
                  className={`mt-4 bg-[#23272B] max-w-max rounded-[20px] py-3 px-6`}
                  onContextMenu={(e) =>
                    handleContextMenu(e, index, data.pinned)
                  }
                >
                  {textAnimationIndex == msgIndex ? (
                    <>
                      <Typewriter
                        text={data.content}
                        delay={15}
                        onTypingEnd={handleTypingEnd}
                      />
                    </>
                  ) : (
                    <ReactMarkDown data={data.content} />
                  )}
                </div>
              )}

              <div className="flex flex-row w-full justify-between pl-7 pr-10 mt-3">
                <div className="flex flex-row gap-5">
                  {Array.isArray(data.content) && (
                    <div className="flex text-[#fff] text-[14.2px] font-helvetica mt-[3px]">
                      <div onClick={handleLeftClick}>
                        <Image
                          alt=""
                          width={7}
                          height={12}
                          src={`svg/Icon-left.svg`}
                          className="cursor-pointer mr-[5px] mt-[3px]"
                        />
                      </div>
                      <p className="leading-normal text-[#fff] text-[14.2px] font-helvetica  tracking-[2px]">
                        {currentMsgIndex + 1} / {totalMsg}
                      </p>

                      <div onClick={handleRightClick}>
                        <Image
                          alt=""
                          width={7}
                          height={12}
                          src={`svg/Icon-right.svg`}
                          className="cursor-pointer ml-[3px] mt-[3px]"
                        />
                      </div>
                    </div>
                  )}

                  <CopyToClipboard
                    text={data.content}
                    onCopy={() => {
                      setCopyStatus(true);
                      setID(index);
                    }}
                  >
                    {copyStatus == false ? (
                      <Image
                        alt=""
                        width={18}
                        height={22}
                        src={`svg/Icon-copy.svg`}
                        className="cursor-pointer"
                      />
                    ) : (
                      <Tooltip
                        content={<p className="text-[#FFF]">Copied</p>}
                        showArrow
                        placement="bottom"
                        delay={0}
                        closeDelay={0}
                        className={`${
                          id == index && copyStatus == true ? "block" : "hidden"
                        }`}
                        classNames={{
                          base: ["before:bg-[#2E353C]"],
                          content: [
                            "bg-[#2E353C] text-sm font-normal leading-4 px-3 py-2",
                          ],
                        }}
                        isOpen={copyStatus}
                        onOpenChange={() => setCopyStatus(false)}
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
                          width={18}
                          height={22}
                          src={`svg/Icon-copy.svg`}
                          className="cursor-pointer"
                        />
                      </Tooltip>
                    )}
                  </CopyToClipboard>
                  {/* <Tooltip
                    content={<p className="text-[#FFF]">Good response</p>}
                    showArrow
                    placement="bottom"
                    delay={0}
                    closeDelay={0}
                    className=""
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
                      width={19}
                      height={18}
                      onClick={() => voteFunc(index)}
                      src={` ${id == index && vote == true
                          ? "svg/voteAction.svg"
                          : "svg/vote.svg"
                        }`}
                      className="cursor-pointer"
                    />
                  </Tooltip>
                  <Tooltip
                    content={<p className="text-[#FFF]">Bad response</p>}
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
                    <Image
                      alt=""
                      width={20}
                      height={19}
                      onClick={() => devoteFunc(index)}
                      src={` ${id == index && deVote == true
                          ? "svg/devoteAction.svg"
                          : "svg/devote.svg"
                        }`}
                      className="cursor-pointer"
                    />
                  </Tooltip> */}

                  <Tooltip
                    content={
                      <p className="text-[#FFF]">
                        {liked ? "Liked Response" : "Like Response"}
                      </p>
                    }
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
                    {liked ? (
                      <Image
                        alt=""
                        width={16}
                        height={21}
                        src={"svg/Icon-heart-red.svg"}
                        className="cursor-pointer"
                        onClick={toggleLike}
                      />
                    ) : (
                      <Image
                        alt=""
                        width={16}
                        height={21}
                        src={"svg/Icon-heart.svg"}
                        className="cursor-pointer"
                        onClick={toggleLike}
                      />
                    )}
                  </Tooltip>

                  <Tooltip
                    content={<p className="text-[#FFF]">Regenerate</p>}
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
                    <Image
                      alt=""
                      width={16}
                      height={21}
                      onClick={() =>
                        Regenerate(msgIndex, chatHistoryID, data.type)
                      }
                      src={"svg/regen.svg"}
                      className="cursor-pointer"
                    />
                  </Tooltip>
                </div>
                {blur == false || index != id ? (
                  <div
                    className={`text-[#A2A2A2] text-base font-normal leading-normal hover:cursor-pointer ml-4`}
                    onClick={() => replyFunction(index, currentMsg)}
                  >
                    Reply
                  </div>
                ) : (
                  <div
                    className={`text-[#A2A2A2] text-base font-normal leading-normal hover:cursor-pointer ml-4`}
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Text_History;

const ContextMenu = ({
  position,
  onClose,
  index,
  chatHistoryID,
  msgIndex,
  setPinnedMessageIndex,
  setUnpinnedMessageIndex,
  contextedMenuPinnedStatus,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const handlePinMessage = () => {
    let data = JSON.stringify({
      id: chatHistoryID,
      index: index,
      msgIndex: msgIndex,
    });

    axios
      .post(`${apiURL}/ai/updatePinnedMessage`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          setPinnedMessageIndex(msgIndex, index);
        }
      });

    onClose();
  };

  const handleReply = (index, chatHistoryID) => {
    console.log("Reply clicked");
    onClose();
  };

  const handleDeleteChat = (index, chatHistoryID) => {
    console.log("Delete Chat clicked");
    onClose();
  };

  const handleUnpinMessage = () => {
    let data = JSON.stringify({
      id: chatHistoryID,
      index: index,
      msgIndex: msgIndex,
    });
    let type = "ai";

    axios
      .post(`${apiURL}/${type}/unPinnedMessage`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          setUnpinnedMessageIndex(msgIndex, index);
        }
      });
    onClose();
    // Function to hide pinned message when close button is clicked
  };

  return (
    <div
      ref={menuRef}
      className="absolute z-10  border-gray-300 rounded shadow"
      style={{ top: position.y, left: position.x }}
    >
      <div className="flex flex-col min-w-[180px] px-3.5 py-2.5 text-sm text-white rounded-3xl border border-solid bg-neutral-900 border-zinc-800 max-w-[200px]">
        {contextedMenuPinnedStatus ? (
          <div
            className="flex gap-3.5 font-nasalization"
            onClick={() => handleUnpinMessage()}
          >
            <img
              loading="lazy"
              src="svg/pin.svg"
              className="shrink-0 aspect-square w-[19px]"
            />
            <img
              loading="lazy"
              src="/Close.png"
              className="shrink-0 aspect-square w-[19px] h-[19px] -ml-[33px] mt-[0px]"
            />
            Unpin Message
          </div>
        ) : (
          <div
            className="flex gap-3.5 font-nasalization"
            onClick={() => handlePinMessage()}
          >
            <img
              loading="lazy"
              src="svg/pin.svg"
              className="shrink-0 aspect-square w-[19px]"
            />
            Pin Message
          </div>
        )}

        {/* <hr className="border-t border-white opacity-20 my-1" />
        <div
          className="flex gap-4 mt-2 whitespace-nowrap font-nasalization "
          onClick={() => handleReply()}
        >
          <img
            loading="lazy"
            src="svg/reply.svg"
            className="shrink-0 self-start aspect-[1.14] fill-stone-300 w-[17px]"
          />
          Reply
        </div> */}
        <hr className="border-t border-white opacity-20 my-1" />
        <div
          className="flex gap-3.5 mt-2 text-pink-500 font-nasalization "
          onClick={() => handleDeleteChat()}
        >
          <img
            loading="lazy"
            src="svg/trash.svg"
            className="shrink-0 w-5 aspect-[0.95]"
          />
          Delete Chat
        </div>
      </div>
    </div>
  );
};
