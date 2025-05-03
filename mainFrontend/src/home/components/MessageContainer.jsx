import React, { useEffect, useState, useRef } from "react";
import userConversation from "../../Zustans/useConversation";
import { useAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../assets/sound/notification.mp3";

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessage } = userConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage((prev) => [...prev, newMessage]);
    });
    return () => socket?.off("newMessage");
  }, [socket, setMessage]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5001/api/message/${selectedConversation._id}`,
          { withCredentials: true }
        );
        const data = res.data;
        setLoading(false);
        if (data.success === false) return;
        setMessage(data);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    getMessages();
  }, [selectedConversation?._id, setMessage]);

  const handleSend = async (e) => {
    e.preventDefault(); // ✅ Prevent form reload
    if (!sendData.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(
        `http://localhost:5001/api/message/send/${selectedConversation._id}`,
        { messages: sendData },
        { withCredentials: true }
      );

      const data = res.data;
      setSending(false);
      if (data.success === false) return;

      setSendData(""); // ✅ clear input
      setMessage((prev) => [...prev, data]); // ✅ add new message to state

      socket?.emit("sendMessage", {
        ...data,
        senderId: authUser._id,
        receiverId: selectedConversation._id,
      });
    } catch (error) {
      setSending(false);
      console.error(error);
    }
  };


  return (
    <div className="md:min-w-[500px] h-[99%] flex flex-col py-2">
      {!selectedConversation ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2">
            <p className="text-2xl">Welcome!!👋 {authUser.name}😉</p>
            <p className="text-lg">Select a chat to start messaging</p>
            <TiMessages className="text-6xl text-center" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className="md:hidden ml-1 self-center">
                <button
                  onClick={onBackUser}
                  className="bg-white rounded-full px-2 py-1"
                >
                  <IoArrowBackSharp size={25} />
                </button>
              </div>
              <div className="flex justify-between mr-2 gap-2">
                <img
                  className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                  src={selectedConversation?.profileimage}
                  alt="profile"
                />
                <span className="text-gray-950 self-center text-sm md:text-xl font-bold">
                  {selectedConversation?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-2">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                <div className="loading loading-spinner"></div>
              </div>
            )}
            {!loading &&
              (!Array.isArray(messages) || messages.length === 0) && (
                <p className="text-center text-white items-center">
                  Send a message to start conversation
                </p>
              )}
            {!loading &&
              Array.isArray(messages) &&
              messages.map((message) => (
                <div
                  key={message?._id}
                  ref={lastMessageRef}
                  className="text-white"
                >
                  <div
                    className={`chat ${
                      message.senderId === authUser._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className="chat-bubble bg-sky-600">
                      {message?.message}
                    </div>
                    <div className="chat-footer text-[10px] opacity-80">
                      {new Date(message?.createdAt).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <form
            onSubmit={handleSend}
            className="rounded-full text-black mt-2 px-2"
          >
            <div className="w-full rounded-full flex items-center bg-white">
              <input
                value={sendData}
                onChange={(e) => setSendData(e.target.value)}
                required
                type="text"
                className="w-full bg-transparent outline-none px-4 py-2 rounded-full"
              />
              <button type="submit" disabled={sending}>
                {sending ? (
                  <div className="loading loading-spinner"></div>
                ) : (
                  <IoSend
                    size={25}
                    className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1"
                  />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
