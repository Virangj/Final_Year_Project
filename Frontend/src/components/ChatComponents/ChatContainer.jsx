import React, { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import ChatHeader from "./ChatHeaderComponent";
import ChatInput from "./ChatInputComponent";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils";

const ChatContainer = () => {
  const { getMessages, selectedUser, messages, isMessageLoading } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    // subscribeToMessages();

    // return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoVie({ behavior: "smooth" });
    }
  }, [messages]);
  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );
  }
  return (
    <>
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div
          className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-200 text-white 
             scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#52525b transparent",
          }}
        >
          {messages.map((message) => {
            const isSender = message.senderId === authUser._id;
            const profilePic = isSender
              ? authUser.profilePic || "/avatar.png"
              : selectedUser.profilePic || "/avatar.png";

            return (
              <div
                key={message._id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                {/* Message block */}
                <div
                  className={`flex ${
                    isSender ? "flex-row-reverse" : "flex-row"
                  } items-end gap-2 max-w-[80%]`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                    <img
                      src={profilePic}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Message content */}
                  <div className="max-w-[75%]">
                    <div
                      className={`rounded-2xl px-4 py-2 text-sm 
                ${
                  isSender
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-800 text-white"
                }
                break-words inline-block`}
                    >
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="rounded-md mb-2 max-w-full"
                        />
                      )}
                      {message.text && <p>{message.text}</p>}
                    </div>

                    <time className="text-xs text-zinc-400 mt-1 block text-end">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ChatInput />
      </div>
    </>
  );
};

export default ChatContainer;
