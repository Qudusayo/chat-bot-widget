import React, { RefObject, useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import IconX from "./components/IconX";
import MailIcon from "./components/MailIcon";
import { v4 as uuidv4 } from "uuid";
import ChatIcon from "./components/ChatIcon";

function App() {
  const [chat, setChat] = useState<
    {
      text: string;
      type: "agent" | "user";
      id: string;
    }[]
  >([]);
  const [chatBotId, setChatBotId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [show, setShow] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (chatContainerRef?.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]); // Update when 'messages' prop changes

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChat((prev) => [
      ...prev,
      { text: userMessage, type: "user", id: uuidv4() },
    ]);
    setUserMessage("");

    setIsLoading(true);
    try {
      let request = await fetch(
        "https://api.ecomassist.ai/v1/create-response",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatbotID: chatBotId,
            sessionID: sessionId,
            reply: userMessage,
            sessionData: {
              id: "daq35s1ir1juwa",
            },
          }),
        }
      );
      let response = await request.json();
      setChat((prev) => [
        ...prev,
        { text: response.data.text, type: "agent", id: uuidv4() },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get session ID from local storage
    const sessionId = localStorage.getItem("chat-bot-sessionId");
    if (sessionId) {
      setSessionId(sessionId);
    } else {
      // Create session ID
      const newSessionId = uuidv4();
      localStorage.setItem("chat-bot-sessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const startNewSession = () => {
    // Create session ID
    const newSessionId = uuidv4();
    localStorage.setItem("chat-bot-sessionId", newSessionId);
    setSessionId(newSessionId);
    setChat([]);
  };

  return (
    <>
      {chatOpen && (
        <Transition.Root show={show}>
          <FadeIn delay="delay-[300ms]">
            <div className="w-[450px] bg-base-100 h-[650px] flex flex-col rounded-2xl fixed right-4 bottom-24">
              <div className="col-span-2 h-[25%] bg-primary rounded-t-2xl px-4 flex flex-col items-center justify-center">
                <div>
                  <h2 className="text-center font-bold text-2xl text-white">
                    Chat with our AI ✨
                  </h2>
                  <span className="text-white">
                    Ask any question and our AI will answer!
                  </span>
                </div>
                <div className="mt-2">
                  <button className="btn btn-sm" onClick={startNewSession}>
                    New chat
                  </button>
                </div>
              </div>
              <div
                className="flex-1 px-4 overflow-y-auto py-4"
                ref={chatContainerRef}
              >
                <AgentChat message="Hi there 👋 I'm the AI Assistant. How can I help you today?" />
                {chat.map((item) =>
                  item.type === "agent" ? (
                    <AgentChat message={item.text} key={item.id} />
                  ) : (
                    <MyChat message={item.text} key={item.id} />
                  )
                )}
                {isLoading && <AgentChat message="" typing />}
              </div>

              <form
                className="h-[15%] rounded-b-2xl py-2 px-4 flex flex-col items-center justify-around"
                onSubmit={handleFormSubmit}
              >
                <div className="relative text-gray-600 focus-within:text-gray-400 w-full">
                  <input
                    type="text"
                    className="py-3 w-full text-sm text-white bg-neutral rounded-md pr-10 pl-4 focus:outline-none"
                    placeholder="Type your message here..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                      type="submit"
                      className="p-1 focus:outline-none focus:shadow-outline"
                    >
                      <MailIcon className="h-6 w-6" />
                    </button>
                  </span>
                </div>
                <span className="text-xs block text-gray-400 text-center">
                  Press <kbd>Enter</kbd> to send
                </span>
              </form>
            </div>
          </FadeIn>
        </Transition.Root>
      )}
      <button
        type="button"
        onClick={() => {
          setShow(!show);
          setChatOpen(!chatOpen);
        }}
        className="w-16 h-16 bg-primary rounded-full fixed right-4 bottom-4 flex items-center justify-center text-white"
      >
        {chatOpen ? (
          <IconX className="text-2xl" onClick={() => setChatOpen(false)} />
        ) : (
          <ChatIcon className="text-2xl" onClick={() => setChatOpen(true)} />
        )}
      </button>
    </>
  );
}

const AgentChat = ({
  message,
  typing,
}: {
  message: string;
  typing?: boolean;
}) => (
  <div className="chat chat-start">
    <div className="chat-image avatar">
      <div className="w-10 rounded-full">
        <img
          alt="Tailwind CSS chat bubble component"
          src={
            "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          }
        />
      </div>
    </div>
    <div className={`chat-bubble w-auto ${typing && " px-10"}`}>
      {!typing ? (
        message.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))
      ) : (
        <div className="flex items-center justify-center space-x-2 absolute inset-0 m-auto">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce duration-0 ease-linear"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce duration-75 ease-linear delay-500"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce duration-150 ease-linear delay-1000"></div>
        </div>
      )}
    </div>
  </div>
);

const MyChat = ({ message }: { message: string }) => (
  <div className="chat chat-end">
    <div className="chat-bubble chat-bubble-primary text-white">{message}</div>
  </div>
);

const FadeIn = ({
  delay,
  children,
}: {
  delay: string;
  children: React.ReactNode;
}) => (
  <Transition.Child
    enter={`transition-all ease-in-out duration-700 ${delay}`}
    enterFrom="opacity-0 translate-y-6"
    enterTo="opacity-100 translate-y-0"
    leave="transition-all ease-in-out duration-300"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    {children}
  </Transition.Child>
);

export default App;
