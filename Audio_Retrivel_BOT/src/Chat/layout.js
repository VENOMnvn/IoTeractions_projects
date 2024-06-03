import React, { useEffect } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Input,
  Button,
  Layout,
  Menu,
  Typography,
  theme,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import logo from "./../Assets/logo.png";
import "./../App.css";
import { Plus } from "phosphor-react";
import axios from "axios";
import { ArrowOutward, ArrowUpward } from "@mui/icons-material";
import { current } from "@reduxjs/toolkit";

const { Search } = Input;
const { Header, Content, Footer, Sider } = Layout;
const { Dragger } = Upload;

const path = "http://localhost:5000";
// const path = ""
// const path = "https://7ec75264-5058-4711-8a8f-b9fe5071fb47-00-166owuyz3b20a.sisko.replit.dev/";

const Layout_Chat = () => {
  const [isAudioUploaded, setAudioUploaded] = React.useState(false);
  const [Message, setMessage] = React.useState([
    { sender: "ai", msg: "Yeah ! I listened your Audio ,  Now you can ask any Questions" }
  ]);

  const [currentMessage, setCurrentMessage] = React.useState("");
  const [isBotThinking, setBotThinking] = React.useState(false);
  const [fileName, setFileName] = React.useState("");

  const submitHandler = async () => {
    if (currentMessage.length == 0) return;
    setBotThinking(true);
    setMessage([{ sender: "user", msg: currentMessage }, ...Message]);
   
    try {
      const response = await axios.post(path + "/query", {
        fileName,
        query: currentMessage,
      });
      console.log(response);
      setBotThinking(false);
      setMessage([{ sender: "ai", msg: response.data?.choices[0].message?.content }, { sender: "user", msg: currentMessage } ,...Message]);
    } catch (err) {
      console.log(err);
    }

    setBotThinking(false);
    setCurrentMessage("");
  };

  const props = {
    name: "file",
    multiple: false,
    action: `${path}/csv`,

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        console.log(info.file, info.fileList);
        
      }
      if (status === "done") {
        setFileName(info.file?.response?.fileName);
        setAudioUploaded(true);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {},
  };

  useEffect(() => {
    console.log(Message);
  }, [Message]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Avatar src={logo}></Avatar>
        <p className="text-white mx-2">Audio Genie</p>
        <div style={{flex:"1",display:"flex",justifyContent:"flex-end"}}>
        <div
          style={{
            border: "1px solid white",
            borderRadius: "10px",
            float:"right",
            color: "white",
            display: "flex",
            alignItems: "center",
            height: "40px",
            padding: "0px 4px",
            justifySelf: "flex-end",
          }}
          onClick={() => {
            setMessage([
              { sender: "ai", msg: "Yeah ! I listened your Audio ,  Now you can ask any Questions" }
            ])
            setAudioUploaded(!isAudioUploaded);
          }}
          >
          <Plus size={26} color="white"></Plus>
          Upload Another
        </div>
      </div>
      </Header>

      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <div className="m-2 text-lg bg-white rounded p-2 flex justify-center items-center gap-2 ">
          <span className="text-2xl font-bold"> Audio Genie </span>
          <span className="text-gray-400 mr-6">
            Your Wish for Voice Answers Granted
          </span>
          <span>{fileName}</span>
        </div>

        <div
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {isAudioUploaded ? (
            <>
              {" "}
              <div
                style={{
                  padding: "0 24px",
                  minHeight: 280,
                }}
              >
                <div className="chatbox">
                  {isBotThinking ? (
                    <div className={"messages ai ai-thinking"}>
                      <div class="loader"></div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Message.map((message) => (
                    <div
                      className={
                        message.sender == "ai" ? " messages ai" : "messages"
                      }
                    >
                      <span>{message.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  background: colorBgContainer,
                  margin: "auto",
                }}
                width={200}
              >
                <div className="p-2">
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">upload only MP3</p>
                  </Dragger>
                </div>
                Upload any MP3 Audio only to extract information throught AI
              </div>
            </>
          )}
        </div>
      </Content>

      <div className="footer">
        <div>
          <input
            className="QUERY"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          ></input>
          <div onClick={submitHandler} className="buttonSubmit">
            {/* <ArrowOutward></ArrowOutward> */}
            <ArrowUpward></ArrowUpward>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Layout_Chat;
