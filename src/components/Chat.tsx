import React from "react";
import { useState, useEffect } from "react";

// import pdfjs from 'pdfjs-dist/build/pdf';

//styles
// import "@/styles/ChatPage.css";
// COMPONENTS ---------------------------
import Input from "./Input";
import ButtonCustom from "./ButtonCustom";
import UploadFile from "./UploadFile";
import PdfContentExtractor from "./PdfContentExtractor";
// import YourComponent from "./YourComponent";
import axios from "axios";

// import { useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("ws://localhost:50000");

const Chat = () => {
  const [inputValue, setInputValue] = useState<any>("");
  const [serverMessage, setServerMessage] = useState<any>({});
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [file, setFile] = useState<any>();

  const [isChecked, setChecked] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<any>();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user === null) {
      return;
    }

    setCurrentUser(JSON.parse(user));
  }, []);

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const handleChangeInput = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleButtonSend = async () => {
    // const formData = new FormData();
    // formData.append("file", file);
    // console.log(formData);
    // console.log(formData.get("file"));
    // const data = await fetch("http://127.0.0.1:50000/extract", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   mode: "no-cors",
    //   body: JSON.stringify(formData),
    // });
    // console.log(data);
    // // const res = await data.json()
    // // console.log(res.message);
  };

  // socket.on("from-server", (chatMessage) => {
  //   setServerMessage(chatMessage);
  //   console.log(chatMessage);
  //   // setChatMessages( prevMessages => [...prevMessages, chatMessage])
  // });

  const uploadPdf = () => {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("userId", currentUser._id);

    axios
      .post("http://127.0.0.1:5000/extract", formData)
      .then((response) => {
        console.log("PDF uploaded successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error uploading PDF:", error);
      });
  };

  const sendToServer = async (e: any) => {
    try {
      e.preventDefault();
      let clientMessage = {
        role: "client",
        message: inputValue,
      };
      // socket.emit("to-server", clientMessage);

      setChatMessages((prevMessages: any) => [...prevMessages, clientMessage]);
      setInputValue("");

      const res = await fetch("http://127.0.0.1:50000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientMessage),
      });

      const data = await res.json();

      setServerMessage(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      if (serverMessage.role === undefined) {
        return;
      }
      setChatMessages((prevMessages: any) => [...prevMessages, serverMessage]);
    } catch (error) {
      console.log(error);
    }
  }, [serverMessage]);

  return (
    <div className="chat_container">
      <div className="chat">
        {chatMessages.map((message: any, index: any) => (
          <div key={index}>
            {message.role === "chat" ? (
              <div className="chat_messages_container">
                <div className="chat_messages">{message.message}</div>
              </div>
            ) : (
              <div className="user_messages_container">
                <div className="user_messages">{message.message}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={sendToServer} className="input_container">
        <Input
          value={inputValue}
          changeEvent={handleChangeInput}
          classStyle="input"
          placeholderText="Type"
        />
        <ButtonCustom
          classStyle="button"
          textName="Send"
          eventFunction={sendToServer}
          typeButton="submit"
        />
      </form>
      <div>
        <UploadFile setFile={setFile} />
        <button onClick={uploadPdf}>Send</button>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          Share your data
        </label>
      </div>
    </div>
  );
};

export default Chat;
