import { useQuery } from "@blitzjs/rpc"
import React, { useCallback, useEffect } from "react"
import getContext from "../queries/getContextQuery"
import { openAi } from "src/core/integrations/openAi"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

interface ChatProps {
  name: string
  dataId: number
  botContext: string
  botRole: string
}

interface IMessage {
  text: string
  isUsersMessage: boolean
}

const Chat: React.FC<ChatProps> = ({ name, dataId, botContext, botRole }) => {
  const [message, setMessage] = React.useState<IMessage | null>(null)
  const [queryMessage, setQueryMessage] = React.useState<IMessage | null>(null)
  const [messages, setMessages] = React.useState<IMessage[]>([])
  const [isMessageLoading, setIsMessageLoading] = React.useState(false)
  const [context] = useQuery(
    getContext,
    { dataId, searchTerm: queryMessage?.text || "" },
    { suspense: false }
  )

  const generateResponse = useCallback(async () => {
    if (!context || messages.length < 1 || !messages[messages.length - 1]?.isUsersMessage) {
      return
    }

    setIsMessageLoading(true)
    const newBotMessage = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            botRole ||
            `You are a helpful and politeful assistant. ${botRole}. Use this content to help ${context}`,
        },
        {
          role: "system",
          content: `Here is information about the company you work for. Information: "${botContext}". Use this information in my answers and act as an employee of this company.`,
        },
        {
          role: "system",
          content: `Don't reply with long answers. Keep your answers short and to the point.`,
        },
        ...messages.map((data) => ({
          role: (data.isUsersMessage
            ? "user"
            : "assistant") as ChatCompletionRequestMessageRoleEnum,
          content: data.text,
        })),
      ],
    })

    setIsMessageLoading(false)

    if (newBotMessage.data.choices[0]?.message?.content) {
      setMessages([
        ...messages,
        {
          text: newBotMessage.data.choices[0]?.message?.content,
          isUsersMessage: false,
        },
      ])
    } else {
      setMessages([
        ...messages,
        {
          text: "Sorry, I did not understand that. Please try again.",
          isUsersMessage: false,
        },
      ])
    }
  }, [messages, context])

  useEffect(() => {
    if (context) {
      generateResponse().catch((e) => console.error(e))
    }
  }, [context])

  const onEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message) {
      setMessages([...messages, message])
      setQueryMessage(message)
      setMessage(null)
    }
  }

  return (
    <div className="w-full max-w-lg bg-white p-6 py-0 rounded-xl m-8 flex flex-col relative max-h-[600px] overflow-auto border-teal-700 border-solid border-2">
      <div className="text-xl font-bold sticky top-0 pt-8 pb-2 w-full bg-white z-10">{name}</div>
      <div className="flex-grow relative">
        <div className="flex-grow flex flex-col">
          {messages.map((message, i) => {
            return (
              <div
                key={i}
                data-isUsersMessage={message.isUsersMessage}
                className="flex justify-start data-[isUsersMessage=false]:justify-end"
              >
                <div className="py-2 px-4 bg-slate-50 rounded-xl w-fit max-w-[90%] mt-4 overflow-auto max-h-full">
                  {message.text}
                </div>
              </div>
            )
          })}
          {isMessageLoading && (
            <div
              data-isUsersMessage={false}
              className="flex justify-start data-[isUsersMessage=false]:justify-end"
            >
              <div className="py-2 px-4 bg-slate-50 rounded-xl w-fit max-w-[90%] mt-4 overflow-auto max-h-full">
                ...
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 left-0 w-full bg-white pb-6">
          <input
            onChange={(e) => setMessage({ text: e.target.value, isUsersMessage: true })}
            placeholder="Type a message..."
            className=" appearance-none w-full bg-white rounded-xl py-2 px-4 border-2 border-blue-100 mt-4"
            value={message?.text || ""}
            onKeyDown={onEnter}
          />
        </div>
      </div>
    </div>
  )
}

export default Chat
