import React, { useEffect } from "react";
import {
  Avatar,
  Layout,
  theme,
} from "antd";
import logo from "./../Assets/logo.png";
import "./../App.css";
import Graph from "react-graph-vis";
import axios from "axios";
import {ArrowUpward } from "@mui/icons-material";
const { Header, Content, Footer, Sider } = Layout;

const path = "";

const Layout_Chat = () => {

  const [Message, setMessage] = React.useState([
    {
      sender: "ai",
      msg: "Hi , How can I Help you ? ",
    },
  ]);
  
  const [graphObject,setGraphObject] = React.useState(false);
  const [currentMessage, setCurrentMessage] = React.useState("");
  const [isBotThinking, setBotThinking] = React.useState(false);
  const [fileName, setFileName] = React.useState("");

  const submitHandler = async () => {
    setGraphObject(false);
    if (currentMessage.length == 0) return;
    setBotThinking(true);
    setMessage([{ sender: "user", msg: currentMessage }, ...Message]);

    try {
      const response = await axios.post(path + "/query", {
        fileName,
        query: currentMessage,
      });

      const graph_details = JSON.parse(response.data.code.replace('\n',''))
      console.log(graph_details);
      setGraphObject(graph_details);
      setBotThinking(false);

      setMessage([
        { sender: "ai", msg: response.data.context },
        {
          sender: "ai",
          msg: "PMID : " + response.data.title.uid,
        },
        {
          sender: "ai",
          msg: "Title : " + response.data.title.Title["#text"],
        },
        { sender: "user", msg: currentMessage },
        ...Message,
      ]);
    } catch (err) {
      console.log(err);
    }

    setBotThinking(false);
    setCurrentMessage("");
  };

  useEffect(() => {
    // console.log(Message);
  }, [Message]);

  
  const options = {
    layout: {
      hierarchical: true,
    },
    edges: {
      color: "#000000",
    },
    height: "500px",
  };



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
        <p className="text-white mx-2">IoTer</p>
        <div
          style={{ flex: "1", display: "flex", justifyContent: "flex-end" }}
        ></div>
      </Header>

      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <div className="m-2 text-lg bg-white rounded p-2 flex justify-center items-center gap-2 ">
          <span className="text-2xl font-bold">One Shot knowledge Graph</span>
          <span className="text-gray-400 mr-6"></span>
          <span>{fileName}</span>
        </div>

        <div
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <>
            {" "}
            <div
              style={{
                padding: "0 24px",
                minHeight: 280,
              }}
            >
              <div className="chatbox">
                
                {
                  graphObject ? <>
                  <div className="graph">
                  <Graph
                    // style={{border:"1px solid red"}}
                    graph={graphObject}
                  ></Graph>
                </div>
                  </> : ""
                }
               
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
