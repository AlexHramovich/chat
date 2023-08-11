import { ChatCompletionRequestMessageFunctionCall } from "openai"

const contactViaEmailGPTData = {
  name: "contact_via_email",
  description:
    "Contact user with the team via email. Сreates a button in the chat to send an email.",
  parameters: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "User's email address",
      },
    },
  },
}

const contactViaEmail = (data: ChatCompletionRequestMessageFunctionCall) => {
  return {
    type: contactViaEmailGPTData.name,
    message: {
      role: "function",
      name: contactViaEmailGPTData.name,
      content: `<a href="mailto:alex@gitnation.org" class="px-4 py-2 bg-teal-700 bg- text-white font-semibold flex items-center rounded-md hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-opacity-50 active:bg-teal-900 w-full flex justify-center">Send mail</a>`,
    },
  } as IFunctionResponse
}

const contactViaEmailFunction = {
  function: contactViaEmail,
  data: contactViaEmailGPTData,
}

export default contactViaEmailFunction
