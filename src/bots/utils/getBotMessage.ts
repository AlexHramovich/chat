import { ChatCompletionRequestMessageRoleEnum } from "openai"
import { openAi } from "src/core/integrations/openAi"
import contactViaEmailFunction from "../chatFunctions/contactViaEmail"

export interface IMessage {
  text: string
  isUsersMessage: boolean
  role?: string
  functionName?: string
}

interface IGetBotMessageArgs {
  botRole: string
  context: string
  botContext: string
  messages: IMessage[]
}

export const getBotMessage = async ({
  botRole,
  context,
  botContext,
  messages,
}: IGetBotMessageArgs) => {
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
        role:
          (data.role as ChatCompletionRequestMessageRoleEnum) ||
          ((data.isUsersMessage ? "user" : "assistant") as ChatCompletionRequestMessageRoleEnum),
        content: data.text,
        name: data.functionName || undefined,
      })),
    ],
    functions: [contactViaEmailFunction.data],
  })

  return newBotMessage
}
