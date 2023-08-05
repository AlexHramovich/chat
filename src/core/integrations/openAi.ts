import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_TOKEN,
})

export const openAi = new OpenAIApi(configuration)
