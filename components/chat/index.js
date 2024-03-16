"use client";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useModelStatus } from "../context/ModelStatusContext";
import Img_History from "@/components/img_history";
import Text_History from "../text_history";
import "react-contexify/ReactContexify.css";
import Image from "next/image";
import {
  Tabs,
  Tab,
  Tooltip,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Menu, Dropdown, ConfigProvider } from "antd";
import useAutosizeTextArea from "./useAutosizeTextArea";
import { apiURL } from "@/config";

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

const PrivacyPolicyContent = () => {
  return (
    <div className="modal-content">
      <h2 className="modal-heading">Einstein Privacy Policy</h2>

      <div className="modal-section">
        <h3 className="modal-subheading">Introduction</h3>
        <p>
          Einstein AI ("Einstein", "we", "us", or "our") respects the privacy of
          its users ("user", "you", or "your") and is committed to protecting
          your personal information. This Privacy Policy outlines our practices
          regarding the collection, use, and disclosure of your information
          through the use of our Einstein AI application ("Application") and any
          of our services (collectively, "Services").
        </p>
      </div>

      <div className="modal-section">
        <h3 className="modal-subheading">Collection of Information</h3>
        <p>
          We collect information that you provide directly to us, such as when
          you create an account, use our Services, or communicate with us. This
          information may include your name, email address, and any other
          information you choose to provide. We also collect non-personally
          identifiable information, such as usage data and device identifiers,
          to improve our Services.
        </p>
      </div>

      <div className="modal-section">
        <h3 className="modal-subheading">Use of Information</h3>
        <p>
          The information we collect is used to provide, maintain, and improve
          our Services, to communicate with you, and to personalize your
          experience. We do not use your data without your consent, except as
          required by law or as necessary to provide our Services to you.
        </p>
      </div>

      <div className="modal-section">
        <h3 className="modal-subheading">
          Sharing and Disclosure of Information
        </h3>
        <p>
          We do not sell your sensitive data to third parties. Information may
          be shared with third-party service providers who perform services on
          our behalf, under strict privacy agreements. We may also disclose your
          information if required by law or to protect our rights and the safety
          of our users.
        </p>
      </div>

      <div className="modal-section">
        <h3 className="modal-subheading">Data Security</h3>
        <p>
          We implement appropriate technical and organizational measures to
          protect the security of your personal information. However, no
          security system is impenetrable, and we cannot guarantee the security
          of our data.
        </p>
      </div>

      <div className="modal-section">
        <h3 className="modal-subheading">Limitation of Liability</h3>
        <p>
          Einstein AI provides its Services "as is" and makes no representations
          or warranties of any kind, express or implied, as to the Services'
          operation or the information, content, materials, or products included
          on the Services. To the full extent permissible by applicable law,
          Einstein disclaims all warranties, express or implied, including, but
          not limited to, implied warranties of merchantability and fitness for
          a particular purpose. Einstein will not be liable for any damages of
          any kind arising from the use of the Services, including, but not
          limited to direct, indirect, incidental, punitive, and consequential
          damages.
        </p>
        <p>
          Under no circumstances will Einstein AI be liable for any loss or
          damage caused by your reliance on information obtained through the
          Services or caused by the user's conduct. Einstein AI does not assume
          any responsibility for errors or omissions in any content or
          information provided within the Services.
        </p>
        <p>
          By using the Einstein AI Services, you expressly agree that your use
          of the Services is at your sole risk. You shall not hold Einstein AI
          or its licensors and suppliers, as applicable, liable for any damages
          that result from your use of the Services. This comprehensive
          limitation of liability applies to all damages of any kind, including
          (without limitation) compensatory, direct, indirect, or consequential
          damages; loss of data, income, or profit; loss of or damage to
          property; and claims of third parties.
        </p>
      </div>

      <div className="modal-section">
        <h3 className="modal-subheading">User Consent</h3>
        <p>
          By using our Services, you consent to the collection, use, and sharing
          of your information as described in this Privacy Policy. We will not
          use your data for any purpose without your consent.
        </p>
      </div>

      <div className="modal-section">
        <h3 className="modal-subheading">Changes to This Privacy Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page. You
          are advised to review this Privacy Policy periodically for any
          changes.
        </p>
      </div>

      <div className="modal-section">
        <h3 className="modal-subheading">Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a
            href="mailto:coreintelligencellc@gmail.com"
            style={{ textDecoration: "underline" }}
          >
            coreintelligencellc@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

const Chat = ({
  chatStatus,
  chatHistroyID,
  setChatStatus,
  chatHistroyData,
  historySideData,
  setHistorySideData,
  setChatHistoryID,
  setChatTitle,
  chatSideThumbnail,
  setChatSideThumbnail,
  chatTitle,
  mobileStatus,
  imageModel,
  imgHistoryID,
  setImgHistoryID,
  imgHistoryData,
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
  const [type, setType] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [imgHistory, setImgHistory] = useState([]);
  const [blur, setBlur] = useState(false);
  const [value, setValue] = useState("");
  const [id, setID] = useState();
  const textAreaRef = useRef(null);
  const req_qa_box = useRef(null);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] =
    useState(false);

  const handlePrivacyPolicyClick = () => {
    setIsPrivacyPolicyModalOpen(true);
  };

  const menu = (
    <div className="mb-4">
      <Menu>
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
              onClick={() => setTextModel(1)}
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
              onClick={() => setTextModel(2)}
            >
              <Image alt="" width={24} height={24} src={"/models/gemini.png"} />
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
              onClick={() => setTextModel(3)}
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
              onClick={() => setTextModel(0)}
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
              onClick={() => setTextModel(4)}
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
              onClick={() => setTextModel(Math.floor(Math.random() * 5))}
            >
              <Image alt="" width={24} height={24} src={"/models/auto.png"} />
              <p className="text-sm font-medium text-[#FFF] leading-normal">
                Auto select
              </p>
            </div>
          </Tooltip>
        </Menu.Item>
      </Menu>
    </div>
  );

  useEffect(() => {
    if (switchStatus == true) return;
    else req_qa_box.current.scrollTop = req_qa_box.current.scrollHeight;
  }, [chatHistory, switchStatus, imgHistory]);

  useEffect(() => {
    setModelType(selected);
  }, [selected]);

  useEffect(() => {
    setImgModelType(imgSelected);
  }, [imgSelected]);

  useEffect(() => {
    setChatHistory(chatHistroyData);
  }, [chatHistroyData]);

  useEffect(() => {
    setImgHistory(imgHistoryData);
  }, [imgHistoryData]);

  useEffect(() => {
    if (imageModel == false) {
      if (chatHistroyID != "") {
        setID("");
        GetHistoryDataByID(chatHistroyID);
      }
    } else {
      if (imgHistoryID != "") {
        setID("");
        GetHistoryDataByID(imgHistoryID);
      }
    }
  }, [chatHistroyID, imgHistoryID, imageModel]);

  useAutosizeTextArea(textAreaRef.current, value);

  const GetHistoryDataByID = (id) => {
    if (imageModel == false) {
      axios
        .get(`${apiURL}/ai/gethistoryByID/${id}`, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          let a = [];
          response.data.data.history.map((item, index) => {
            item.map((dt, i) => {
              console.log(dt.type);
              if (dt.role == "user" || dt.type == response.data.data.type)
                a.push(dt);
            });
          });
          setModelType(response.data.data.type);
          setType(response.data.data.type);
          setChatHistory(a);
        });
    } else {
      console.log("start img id data");
      axios
        .get(`${apiURL}/img/getImageDataByID/${id}`, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          let a = [];
          response.data.data.history.map((data, index) => {
            data.map((dt, i) => {
              if (dt.role == "user" || dt.type == response.data.data.type)
                a.push(dt);
            });
          });
          console.log(a);
          setImgModelType(response.data.data.type);
          setImgHistory(a);
        });
    }
  };

  function removeTypeField(obj) {
    delete obj.type;
    return obj;
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (imageModel == false) {
        if (value != "") TextGenereate();
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

  const TextGenereate = () => {
    setSwitchStatus(false);
    setChatStatus(true);
    let textResponseData = [];
    let new_history = [...chatHistory];
    new_history.push({ role: "user", content: value }, { role: "loading" });
    setChatHistory(new_history);
    if (chatHistroyID == "") {
      let data = JSON.stringify({
        prompt: value,
        id: chatHistroyID,
        type: selected,
        userID: localStorage.getItem("userID"),
      });
      setChatTitle(value);
      setValue("");
      if (selected == "GPT-4") {
        axios
          .post(`${apiURL}/ai/gpt4`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
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
          });
      } else if (selected == "GPT-3.5") {
        axios
          .post(`${apiURL}/ai/gpt3`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
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
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (selected == "Gemini") {
        axios
          .post(`${apiURL}/ai/gemini`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
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
          });
      } else if (selected == "Mistral") {
        axios
          .post(`${apiURL}/ai/mistral`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
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
          });
      } else if (selected == "Perplexity") {
        axios
          .post(`${apiURL}/ai/perplexityai`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
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
          });
      }
    } else {
      let pasthistory = [];
      chatHistory.map((item) => {
        let a = removeTypeField(item);
        pasthistory.push(a);
      });
      let data = JSON.stringify({
        prompt: value,
        id: chatHistroyID,
        type: type,
        pasthistory: chatHistory,
        userID: localStorage.getItem("userID"),
      });
      setValue("");
      if (modelType == "GPT-4") {
        axios
          .post(`${apiURL}/ai/gpt4`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
          });
      } else if (modelType == "GPT-3.5") {
        axios
          .post(`${apiURL}/ai/gpt3`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return { role: "assistant", content: response.data.data };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
          });
      } else if (modelType == "Gemini") {
        axios
          .post(`${apiURL}/ai/gemini`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
          });
      } else if (modelType == "Mistral") {
        axios
          .post(`${apiURL}/ai/mistral`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
          });
      } else if (modelType == "Perplexity") {
        axios
          .post(`${apiURL}/ai/perplexityai`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            textResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setChatHistory(textResponseData);
            setChatHistoryID(response.data.id);
          });
      }
    }
  };

  const ImageGenerate = () => {
    setSwitchStatus(false);
    setChatStatus(true);
    console.log("Image generation start", imgHistoryID);
    let new_history = [...imgHistory];
    new_history.push({ role: "user", content: value }, { role: "loading" });
    setImgHistory(new_history);
    if (imgHistoryID == "") {
      let data = JSON.stringify({
        prompt: value,
        type: imgSelected,
        id: "",
        userID: localStorage.getItem("userID"),
        size: ratio,
      });
      setChatTitle(value);
      setValue("");
      console.log("Sending api data: ", data);
      if (imgSelected == "DALL-E") {
        axios
          .post(`${apiURL}/img/dall`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            let imgResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            console.log(imgResponseData);
            console.log(response);
            console.log(response.data);
            setImgHistory(imgResponseData);
            setImgHistoryID(response.data.id);
            setHistorySideData([
              {
                id: response.data.id,
                title: value,
                date: response.data.date,
                thumbnail_url: response.data.thumbnail_url,
              },
              ...historySideData,
            ]);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (imgSelected == "Stable Diffusion XL") {
        axios
          .post(`${apiURL}/img/diffu_xl`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            console.log(response.data);
            let imgResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                  size: response.data.size,
                };
              } else {
                return item;
              }
            });
            console.log("@#@#@#@#", imgResponseData);
            setImgHistory(imgResponseData);
            setImgHistoryID(response.data.id);
            setHistorySideData([
              {
                id: response.data.id,
                title: value,
                date: response.data.date,
                thumbnail_url: response.data.thumbnail_url,
              },
              ...historySideData,
            ]);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (imgSelected == "Stable Diffusion 2") {
        axios
          .post(`${apiURL}/img/diffu_two`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            console.log(response.data);
            let imgResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                  size: response.data.size,
                };
              } else {
                return item;
              }
            });
            setImgHistory(imgResponseData);
            setImgHistoryID(response.data.id);
            setHistorySideData([
              {
                id: response.data.id,
                title: value,
                date: response.data.date,
                thumbnail_url: response.data.thumbnail_url,
              },
              ...historySideData,
            ]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      console.log("update img histroy start");
      let data = JSON.stringify({
        prompt: value,
        type: imgModelType,
        id: imgHistoryID,
        userID: localStorage.getItem("userID"),
        size: ratio,
      });
      setValue("");
      console.log("Sending api data: ", data);

      if (imgModelType == "DALL-E") {
        axios
          .post(`${apiURL}/img/dall`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            let imgResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                };
              } else {
                return item;
              }
            });
            setImgHistory(imgResponseData);
            setImgHistoryID(response.data.id);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (imgModelType == "Stable Diffusion XL") {
        axios
          .post(`${apiURL}/img/diffu_xl`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            console.log(response);
            let imgResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                  size: response.data.size,
                };
              } else {
                return item;
              }
            });
            setImgHistory(imgResponseData);
            setImgHistoryID(response.data.id);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (imgModelType == "Stable Diffusion 2") {
        axios
          .post(`${apiURL}/img/diffu_two`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            let imgResponseData = new_history.map((item) => {
              if (item.role === "loading") {
                return {
                  role: "assistant",
                  content: response.data.data,
                  type: response.data.type,
                  size: response.data.size,
                };
              } else {
                return item;
              }
            });
            setImgHistory(imgResponseData);
            setImgHistoryID(response.data.id);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const clearHistory = () => {
    setChatHistory([]);
    // console.log(chatHistroyID);
    // let data = {
    //   id: chatHistroyID
    // };
    // axios
    //   .post(`${apiURL}/ai/clear`, data, {
    //     headers: { "Content-Type": "application/json" }
    //   })
    //   .then((response) => {
    //     setHistory([]);
    //   });
  };

  const handleSelectionChange = (e) => {
    setRatioValue(e.target.value);
    setRatio(ratioList[e.target.value]);
  };

  return (
    <div
      className={`flex flex-1 flex-col pl-8 max-mlg:px-2 ${
        mobileStatus == true ? "" : "max-mlg:hidden"
      }`}
    >
      <div className="flex flex-row z-[1] max-msm:hidden w-xl max-mlg:w-mlg fixed gap-3 justify-between pl-6 rounded-3xl bg-[rgba(39,45,51,0.70)] shadow-[0_0px_1px_0px_rgba(0,0,0,0.25)] backdrop-blur-md">
        <p className="mt-3 font-nasalization text-[#FFF] max-w-[880px]">
          {chatTitle.length < 30
            ? chatTitle.slice(0, 30)
            : chatTitle.slice(0, 30).concat("...")}
        </p>
        <div className="rounded-3xl p-3 shadow-[0_0px_1px_0px_rgba(0,0,0,0.25)]">
          <Image alt="" width={24} height={24} src={"svg/info.svg"} />
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
              {chatHistory.map((data, index) => (
                <Text_History
                  key={index}
                  data={data}
                  chatHistory={chatHistory}
                  chatHistroyID={chatHistroyID}
                  id={id}
                  index={index}
                  setTabSelected={setTabSelected}
                  loading={loading}
                  setChatHistory={setChatHistory}
                  setLoading={setLoading}
                  setSwitchStatus={setSwitchStatus}
                  setID={setID}
                  tabSelected={tabSelected}
                  type={type}
                  setBlur={setBlur}
                  blur={blur}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full max-w-[920px] mx-auto max-mxl:max-w-[900px] max-mlg:max-w-[800px] max-xl:max-w-[600px] max-msm:max-w-[360px] max-msm:mx-auto">
              {imgHistory.map((data, index) => (
                <Img_History
                  key={index}
                  data={data}
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
                />
              ))}
            </div>
          )
        ) : (
          toggleStatus == 1 && (
            <div className="flex flex-col bg-[#23272B] rounded-[20px] max-w-[920px] w-full mx-auto my-auto">
              <div className="flex flex-row m-11 gap-2">
                <Image
                  alt=""
                  width={40}
                  height={34}
                  src={"/logo.png"}
                  className=""
                />
                <p className="text-[#FFF] text-[28px] font-normal leading-normal font-nasalization">
                  Einstein
                </p>
              </div>
              <div className="flex flex-row justify-center text-[#D0D0D0] text-lg font-normal leading-7">
                <p className="max-w-[708px] w-full mx-auto">
                  Einstein Combines the best of all AI models available today.
                  For each question you ask, the best AI will be chosen to
                  respond to you. Here are some of the models we use:
                </p>
              </div>
              <div className="flex flex-row gap-6 font-nasalization text-[#C2C2C2] text-sm font-normal mx-auto my-11">
                {imageModel == false ? (
                  <Tabs
                    size="sm"
                    radius="lg"
                    variant="light"
                    selectedKey={selected}
                    onSelectionChange={setSelected}
                    classNames={{
                      tabList: "w-full relative border-divider p-0",
                      cursor: "w-full bg-[#2E353C] p-0",
                      tabContent:
                        "group-data-[selected=true]:text-[#FFF] p-0 font-nasalization",
                    }}
                    aria-label="Tabs variants"
                  >
                    {textStatus.map(
                      (item, index) =>
                        item && (
                          <Tab key={textList[index]} title={textList[index]} />
                        )
                    )}
                  </Tabs>
                ) : (
                  <Tabs
                    size="sm"
                    radius="lg"
                    variant="light"
                    selectedKey={imgSelected}
                    onSelectionChange={setImgSelected}
                    classNames={{
                      tabList: "w-full relative border-divider p-0",
                      cursor: "w-full bg-[#2E353C] p-0",
                      tabContent:
                        "group-data-[selected=true]:text-[#FFF] p-0 font-nasalization",
                    }}
                    aria-label="Tabs variants"
                  >
                    {imgStatus.map(
                      (item, index) =>
                        item && (
                          <Tab key={imgList[index]} title={imgList[index]} />
                        )
                    )}
                  </Tabs>
                )}
              </div>
            </div>
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
          <Select
            aria-label="eee"
            radius="full"
            selectedKeys={[ratioValue]}
            onChange={handleSelectionChange}
            labelPlacement="outside"
            className="gap-0 p-0 max-w-[90px] font-nasalization text-[#FFF] text-sm font-normal aria-disabled:label"
            classNames={{
              trigger: "bg-[#2E353C] text-[#FFF]",
              listbox: "bg-[#2E353C] m-0 p-0 text-[#FFF]",
              popoverContent: "bg-[#2E353C]",
            }}
          >
            <SelectItem
              key={0}
              value={0}
              className="font-nasalization font-normal text-sm"
            >
              1:1
            </SelectItem>
            <SelectItem
              key={1}
              value={1}
              className="font-nasalization font-normal text-sm"
            >
              9:7
            </SelectItem>
            <SelectItem
              key={2}
              value={2}
              className="font-nasalization font-normal text-sm"
            >
              19:13
            </SelectItem>
            <SelectItem
              key={3}
              value={3}
              className="font-nasalization font-normal text-sm"
            >
              7:4
            </SelectItem>
            <SelectItem
              key={4}
              value={4}
              className="font-nasalization font-normal text-sm"
            >
              7:9
            </SelectItem>
            <SelectItem
              key={5}
              value={5}
              className="font-nasalization font-normal text-sm"
            >
              13:19
            </SelectItem>
            <SelectItem
              key={6}
              value={6}
              className="font-nasalization font-normal text-sm"
            >
              4:7
            </SelectItem>
            <SelectItem
              key={7}
              value={7}
              className="font-nasalization font-normal text-sm"
            >
              5:12
            </SelectItem>
          </Select>
        </div>
        <div className="flex flx-row items-end gap-2 w-full max-msm:mb-3">
          {imageModel == false ? (
            <Tooltip
              content={<p className="text-[#FFF]">Erase Context</p>}
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
                width={20}
                height={20}
                src={"/svg/inputedit.svg"}
                onClick={() => clearHistory()}
                className="cursor-pointer mb-3 max-lg:hidden"
              />
            </Tooltip>
          ) : null}
          <div className="relative flex items-end gap-4 rounded-3xl border-[2px] bprder-solid border-[#0A84FF] w-full h-auto p-[2px]">
            {imageModel == false ? (
              <ConfigProvider
                theme={{
                  token: {
                    colorBgBase: "#181818",
                    borderRadius: 20,
                    colorBorder: "#313535",
                  },
                }}
              >
                <Dropdown overlay={menu}>
                  <Image
                    alt=""
                    width={34}
                    height={34}
                    src={
                      textModel == 0
                        ? "/models/gpt3.png"
                        : textModel == 1
                        ? "/models/gpt4.png"
                        : textModel == 2
                        ? "/models/gemini.png"
                        : textModel == 3
                        ? "/models/perplexity.png"
                        : textModel == 4
                        ? "/models/mistral.png"
                        : ""
                    }
                    className="mb-[2px] ml-1"
                  />
                </Dropdown>
              </ConfigProvider>
            ) : null}
            <Image
              alt=""
              width={11}
              height={20}
              src={"svg/attach.svg"}
              className={` ${
                imageModel == false ? "ml-1" : "ml-5"
              } max-h-10 mb-2`}
            />
            <textarea
              id="review-text"
              onChange={handleChange}
              value={value}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder={blur ? "Reply" : "Message Einstein"}
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
                onClick={() => TextGenereate()}
              />
            </div>
          </div>
        </div>
        <div className="max-msm:hidden text-[#FFF] text-[12px] font-normal leading-normal mt-3">
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
          <div className="modal-container">
            <div
              className="modal-backdrop"
              onClick={() => setIsPrivacyPolicyModalOpen(false)}
            ></div>
            <div className="modal-box">
              <div className="modal-header">
                <CloseOutlined
                  className="close-icon"
                  onClick={() => setIsPrivacyPolicyModalOpen(false)}
                />
              </div>
              <div className="modal-content-scrollable">
                <PrivacyPolicyContent />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
