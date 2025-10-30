"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { MessageSquare } from "lucide-react";
import { UIMessage } from "ai";

const RAGPage = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) return;

    sendMessage({ text: message.text });
    setInput("");
  };
  return (
    <div className="max-w-4xl  mx-auto size-full relative h-[calc(100vh-1rem)] ">
      <div className="flex flex-col h-full">
        <Conversation className="">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="No messages yet"
                description="Start a conversation to see messages here"
              />
            ) : (
              messages.map((message: UIMessage) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text": // we don't use any reasoning or tool calls in this example
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          {(status === "submitted" || status === "streaming") && <Loader />}

          <ConversationScrollButton />
        </Conversation>
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody className="">
            <PromptInputTextarea
              value={input}
              className="p-5 max-h-3"
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
          </PromptInputBody>
          <PromptInputTools />
          <PromptInputSubmit
            className="cursor-pointer"
            disabled={!input && !status}
            status={status}
          />
        </PromptInput>
      </div>
    </div>
  );
};

export default RAGPage;
