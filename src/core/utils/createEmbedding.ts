import { openAi } from "../integrations/openAi"

export const createEmbedding = async (content: string) => {
  const embeddingRes = await openAi.createEmbedding({
    model: "text-embedding-ada-002",
    input: content,
  })

  // @ts-ignore
  const [{ embedding }] = embeddingRes.data.data

  return embedding
}
