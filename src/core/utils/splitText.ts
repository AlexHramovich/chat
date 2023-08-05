import { encode } from "gpt-3-encoder"

interface ResultChunk {
  content: string
  contentLength: number
  contentTokens: number
}

export const splitText = (unformattedText: string, limit = 1500) => {
  const text = unformattedText.replace(/\n/g, ". ")
  const textChunks: string[] = []

  if (encode(text).length > limit) {
    const splittedText: string[] = text.split(". ")
    let chunkText: string = ""

    splittedText.forEach((sentence) => {
      const sentenceTokenLength = encode(sentence).length
      const chunkTextTokenLength = encode(chunkText).length

      if (sentenceTokenLength + chunkTextTokenLength > limit) {
        textChunks.push(chunkText)
        chunkText = ""
      }

      if (sentence[sentence.length - 1] && sentence?.[sentence?.length - 1]?.match(/[a-z0-9]/i)) {
        chunkText += `${sentence}. `
      } else {
        chunkText += `${sentence} `
      }
    })

    textChunks.push(chunkText.trim())
  } else {
    textChunks.push(text.trim())
  }

  let resultChunks: ResultChunk[] = textChunks.map((chunk) => {
    const trimmedText = chunk.trim()

    return {
      content: trimmedText,
      contentLength: trimmedText.length,
      contentTokens: encode(trimmedText).length,
    }
  })

  if (resultChunks.length > 1) {
    resultChunks = resultChunks.filter((chunk, index) => {
      const prevChunk = resultChunks[index - 1]

      if (chunk.contentTokens < 750 && prevChunk) {
        prevChunk.content += chunk.content
        prevChunk.contentLength += chunk.contentLength
        prevChunk.contentTokens += chunk.contentTokens

        return false
      }

      return true
    })
  } else {
    resultChunks = resultChunks.filter(Boolean)
  }

  return resultChunks
}
