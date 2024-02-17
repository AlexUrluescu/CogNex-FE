import React from "react";
import Chat from "../components/Chat";

const ChatPage = () => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {};

  const url = process.env.NEXT_PUBLIC_ROUTE;

  const handleSend = async (event: any) => {
    event.preventDefault();

    try {
      const res = await fetch(`${url}/test2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "hei" }),
      });

      const data = await res.json();

      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    const res = await fetch("http://127.0.0.1:5000/test");
    const data = await res.json();

    console.log("data", data);
  };

  return (
    <div>
      <div>
        <h1>CogNex</h1>
        <button onClick={handleClick}>test</button>
        <input type="text" onChange={handleChange}></input>
        <button onClick={handleSend}>send</button>
      </div>
      <Chat />
    </div>
  );
};

export default ChatPage;
