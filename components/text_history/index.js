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

const ContextMenu = ({ position, onClose }) => {
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
    console.log("Pin Message clicked");
    onClose();
  };

  const handleReply = () => {
    console.log("Reply clicked");
    onClose();
  };

  const handleDeleteChat = () => {
    console.log("Delete Chat clicked");
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute z-10  border-gray-300 rounded shadow"
      style={{ top: position.y, left: position.x }}
    >
      <div className="flex flex-col px-3.5 py-2.5 text-sm text-white rounded-3xl border border-solid bg-neutral-900 border-zinc-800 max-w-[170px]">
        <div
          className="flex gap-3.5 font-nasalization"
          onClick={handlePinMessage}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/713fcfb81569259aa416af0897559d00d95a5a988a06f5f343ddf7fbab0be089?apiKey=6de9a78aeb4b4f99a25ac6d0f9462b85&"
            className="shrink-0 aspect-square w-[19px]"
          />
          Pin Message
        </div>
        <hr className="border-t border-white opacity-20 my-1" />
        <div
          className="flex gap-4 mt-2 whitespace-nowrap font-nasalization "
          onClick={handleReply}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/90b7eeeb6bf39af11ebb11cb9ec49d25a1ca4ad8248115a41ea1e336ff1f80dd?apiKey=6de9a78aeb4b4f99a25ac6d0f9462b85&"
            className="shrink-0 self-start aspect-[1.14] fill-stone-300 w-[17px]"
          />
          Reply
        </div>
        <hr className="border-t border-white opacity-20 my-1" />
        <div
          className="flex gap-3.5 mt-2 text-pink-500 font-nasalization "
          onClick={handleDeleteChat}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e27d9edb44a4b1cc6c6733ac25ffa0e13bd9f56222deb91bf014d92c06f39d5?apiKey=6de9a78aeb4b4f99a25ac6d0f9462b85&"
            className="shrink-0 w-5 aspect-[0.95]"
          />
          Delete Chat
        </div>
      </div>
    </div>
  );
};

const Text_History = ({
  data,
  chatHistory,
  chatHistroyID,
  id,
  index,
  setTabSelected,
  loading,
  setChatHistory,
  setLoading,
  setSwitchStatus,
  setID,
  tabSelected,
  type,
  setBlur,
  blur,
}) => {
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to handle right-click on user messages
  const handleContextMenu = (e, index) => {
    e.preventDefault();
    if (e.type === "contextmenu" && e.clientX !== 0 && e.clientY !== 0) {
      // Only set context menu position on right-click
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
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

  const submitEdit = (index) => {
    console.log("Submit Edit CLicked! now call api!");
    const updatedChatHistory = [...chatHistory];
    updatedChatHistory[index].content = editingMessage;
    updatedChatHistory.splice(index + 1); // Remove messages after the edited message

    let pasthistory = [];
    updatedChatHistory.map((item, index) => {
      let data = item;
      pasthistory.push(data);
    });

    let sumData = {
      type: type,
      history: pasthistory,
      id: chatHistroyID,
      number: (index - 1) / 2,
      userID: localStorage.getItem("userID"),
    };

    updatedChatHistory.push({ role: "loading" });
    setChatHistory(updatedChatHistory);

    // Mocking API call, replace it with your actual API call
    setTimeout(() => {
      axios
        .post(`${apiURL}/ai/edit`, sumData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          let a = [...pasthistory];
          a.push(response.data.data);
          setLoading(false);
          setChatHistory(a);
        });
    }, 2000); // Mock API response time (2 seconds)
  };

  const getDataByType = (id, i) => {
    axios
      .get(`${apiURL}/ai/gethistoryByID/${id}`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        let a = [...chatHistory];
        let b = [];
        response.data.data.history[(i - 1) / 2].map((item, index) => {
          if (item.type == tabSelected) b.push(item);
        });
        a[i] = b[0];
        setLoading(false);
        setChatHistory(a);
      });
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

  const Summarize = (data, id) => {
    axios
      .post(`${apiURL}/ai/summarize`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        let a = [...chatHistory];
        a[id]["content"] = response.data.data;
        setLoading(false);
        setChatHistory(a);
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

  const Regenerate = (i) => {
    setLoading(true);
    setID(i);
    let pasthistory = [];
    chatHistory.slice(0, i).map((item) => {
      let data = removeTypeField(item);
      pasthistory.push(data);
    });
    let data = {
      historyData: pasthistory,
      type: type,
    };
    axios
      .post(`${apiURL}/ai/regenerate`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data.data);
        let a = [...chatHistory];
        a[i]["content"] = response.data.data;
        setLoading(false);
        setChatHistory(a);
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
                      submitEdit(index);
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
              onContextMenu={(e) => handleContextMenu(e, index)}
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
      {contextMenuPosition && data.role === "user" && (
        <ContextMenu
          position={contextMenuPosition}
          onClose={() => setContextMenuPosition(null)}
          // Add any necessary props or actions for the context menu component
        />
      )}
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
                onClick={(e) => {
                  let pasthistory = [];
                  chatHistory.slice(0, index).map((item, index) => {
                    let data = removeTypeField(item);
                    pasthistory.push(data);
                  });
                  let sumData = {
                    old_type: type,
                    new_type: e.target.outerText,
                    history: pasthistory,
                    id: chatHistroyID,
                    number: (index - 1) / 2,
                    userID: localStorage.getItem("userID"),
                  };
                  setSwitchStatus(true);
                  setLoading(true);
                  setID(index);
                  let x = {
                    id: (index - 1) / 2,
                    historyID: chatHistroyID,
                  };
                  axios
                    .post(`${apiURL}/ai/getType/`, x, {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    })
                    .then((response) => {
                      if (response.data.data.indexOf(tabSelected) == -1)
                        Summarize(sumData, index);
                      else getDataByType(chatHistroyID, index);
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
              >
                <ReactMarkDown data={data.content} />
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
                      onClick={() => Regenerate(index)}
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
