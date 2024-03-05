import axios from "axios";
import React, { useState } from "react";
import { useModelStatus } from "../context/ModelStatusContext";
import Image from "next/image";
import Link from "next/link";
import { Tabs, Tab, Tooltip } from "@nextui-org/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkDown from "../Markdown";
import { apiURL } from "@/config";

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
      {data.role == "user" ? (
        <div className={`flex justify-end w-full mb-4 pr-5 max-mxl:pr-0`}>
          <p className="max-w-[650px] max-xl:max-w-[400px] max-msm:max-w-[250px] break-words text-[20px] text-[#FFF] font-helvetica font-normal leading-8 bg-[#0A84FF] rounded-[20px] py-3 px-5">
            <ReactMarkDown data={data.content} />
          </p>
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
