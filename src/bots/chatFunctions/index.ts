import contactViaEmailFunction from "./contactViaEmail"
import { ChatCompletionRequestMessageFunctionCall } from "openai"

export const runChatFunction = (functionData: ChatCompletionRequestMessageFunctionCall) => {
  if (functionData.name === contactViaEmailFunction.data.name) {
    return contactViaEmailFunction.function(functionData)
  }
}
