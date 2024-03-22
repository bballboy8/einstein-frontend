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
  chatHistroyID,
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

  const [editingMessage, setEditingMessage] = useState("");
  const [editModeIndex, setEditModeIndex] = useState(-1);
  const textareaRef = useRef(null);
  const [contextMenuPosition, setContextMenuPosition] = useState(null); // State to store context menu position
  const [contextedMenuPinnedStatus, setContextedMenuPinnedStatus] =
    useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contextedMenuIndex, setContextedMenuIndex] = useState();

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
    console.log("Editing message for model; ", modelType);
    updatedChatHistory[msgIndex].splice(index + 1); // Remove messages after the edited message
    updatedChatHistory.splice(msgIndex + 1); // Remove messages after the edited message

    let pasthistory = [];
    updatedChatHistory.forEach((item) => {
      let data = [...item]; // Create a shallow copy of the item
      pasthistory.push(data);
    });

    let sumData = {
      type: modelType,
      history: pasthistory,
      id: chatHistroyID,
      number: (index - 1) / 2,
      userID: localStorage.getItem("userID"),
    };

    // Add loading message to indicate API call is in progress
    updatedChatHistory[msgIndex].push({ role: "loading" });
    setChatHistory(updatedChatHistory);

    // if (
    //   updatedChatHistory[msgIndex][index].hasOwnProperty("pinned") &&
    //   updatedChatHistory[msgIndex][index].pinned === true
    // ) {
    //   console.log("piinned message: ");
    //   // The key "pinned" exists and its value is true
    //   onSetPinnedMessageIndex(msgIndex, index);
    // }

    checkEditPinnedMessage(msgIndex, index, "text", editingMessage);

    // Mocking API call, replace it with your actual API call
    axios
      .post(`${apiURL}/ai/edit`, sumData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoading(false);
        // Remove loading message when response is received
        let updatedChatHistory = response.data.data;
        setChatHistory(updatedChatHistory);
        setTextAnimationIndex(msgIndex);
      })
      .catch((error) => {
        console.error("Error editing message:", error);
      });
  };

  // const getDataByType = (id, i) => {
  //   axios
  //     .get(`${apiURL}/ai/gethistoryByID/${id}`, {
  //       headers: { "Content-Type": "application/json" },
  //     })
  //     .then((response) => {
  //       let a = [...chatHistory];
  //       let b = [];
  //       response.data.data.history[(i - 1) / 2].map((item, index) => {
  //         if (item.type == tabSelected) b.push(item);
  //       });
  //       a[i] = b[0];
  //       setLoading(false);
  //       setChatHistory(a);
  //     });
  // };

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

  const Summarize = (data, msgIndex, index) => {
    // let chatHistoryCopy = [...chatHistory];
    // let slicedChatHistory = chatHistory.slice(0, msgIndex);
    chatHistory[msgIndex][index]["role"] = "loading";
    // setChatHistory(slicedChatHistory);
    setChatHistory(chatHistory);
    setLoading(true);
    axios
      .post(`${apiURL}/ai/summarize`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        chatHistory[msgIndex][index]["content"] = response.data.data;
        chatHistory[msgIndex][index]["type"] = data.new_type;
        chatHistory[msgIndex][index]["role"] = "assistant";
        setLoading(false);
        setTextAnimationIndex(msgIndex);
        setChatHistory(chatHistory);
      });
  };

  const voteFunc = (i) => {
    setID(i);
    if (vote == true) {
      setVote(false);
    } else {
      setVote(true);
      if (deVote == true) {
        setDeVote(false);
      }
    }
  };

  const devoteFunc = (i) => {
    setID(i);
    if (deVote == true) {
      setDeVote(false);
    } else {
      setDeVote(true);
      if (vote == true) {
        setVote(false);
      }
    }
  };

  const Regenerate = (i, chatHistroyID) => {
    setLoading(true);
    setID(i);
    let pasthistory = [];
    chatHistory.slice(0, i + 1).map((item) => {
      let data = item.slice(0, -1); // Remove the last element of the array
      pasthistory.push(data);
    });

    let data = {
      historyData: pasthistory,
      type: chatHistory[i][1].type,
      index: i,
      id: chatHistroyID,
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
        a[msgIndex][1]["content"] = response.data.data;
        a[msgIndex][1]["role"] = "assistant";
        setLoading(false);
        setTextAnimationIndex(msgIndex);
        setChatHistory(a);
        setModelType(chatHistory[i][1].type);
      });
  };

  function removeTypeField(obj) {
    delete obj.type;
    return obj;
  }

  const replyFunction = (index) => {
    setBlur(true);
    setID(index);
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

  const onChangeTabSelected = (outerText) => {
    setTabSelected(outerText);
    let pasthistory = [];

    chatHistory.slice(0, msgIndex + 1).map((item) => {
      let data = item.slice(0, -1); // Remove the last element of the array
      data.map((msg, j) => {
        pasthistory.push(msg);
      });
    });

    let sumData = {
      old_type: chatHistory[msgIndex][1]["type"],
      new_type: outerText,
      history: [...pasthistory],
      id: chatHistroyID,
      number: msgIndex,
      userID: localStorage.getItem("userID"),
    };
    setSwitchStatus(true);
    setID(chatHistroyID);
    setModelType(outerText);
    Summarize(sumData, msgIndex, index);
  };
  return (
    <div key={index} className="flex flex-col w-full">
      {/* user compannent */}
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
                      submitEdit(index, msgIndex);
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
          chatHistroyID={chatHistroyID}
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
                onClick={(e) => onChangeTabSelected(e.target.outerText)}
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
            <div className="flex flex-col max-w-max mr-[138px] max-mxl:mr-[220px] max-xl:mr-[100px] max-msm:mr-12 mb-4">
              <div
                className={`mt-4 bg-[#23272B] max-w-max rounded-[20px] py-3 px-6`}
                onContextMenu={(e) => handleContextMenu(e, index, data.pinned)}
              >
                {textAnimationIndex == msgIndex ? (
                  <Typewriter text={data.content} delay={15} />
                ) : (
                  <ReactMarkDown data={data.content} />
                )}
              </div>
              <div className="flex flex-row w-full justify-between pl-7 pr-10 mt-3">
                <div className="flex flex-row gap-6">
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
                        src={`svg/copy.svg`}
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
                          src={`svg/copy.svg`}
                          className="cursor-pointer"
                        />
                      </Tooltip>
                    )}
                  </CopyToClipboard>
                  <Tooltip
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
                      src={` ${
                        id == index && vote == true
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
                      src={` ${
                        id == index && deVote == true
                          ? "svg/devoteAction.svg"
                          : "svg/devote.svg"
                      }`}
                      className="cursor-pointer"
                    />
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
                      onClick={() => Regenerate(msgIndex, chatHistroyID)}
                      src={"svg/regen.svg"}
                      className="cursor-pointer"
                    />
                  </Tooltip>
                </div>
                {blur == false || index != id ? (
                  <div
                    className={`text-[#A2A2A2] text-base font-normal leading-normal hover:cursor-pointer ml-4`}
                    onClick={() => replyFunction(index)}
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
  chatHistroyID,
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
      id: chatHistroyID,
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

  const handleReply = (index, chatHistroyID) => {
    console.log("Reply clicked");
    onClose();
  };

  const handleDeleteChat = (index, chatHistroyID) => {
    console.log("Delete Chat clicked");
    onClose();
  };

  const handleUnpinMessage = () => {
    let data = JSON.stringify({
      id: chatHistroyID,
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

        <hr className="border-t border-white opacity-20 my-1" />
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
        </div>
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
