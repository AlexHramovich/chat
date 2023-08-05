import { api } from "src/blitz-server"
import db, { DataType } from "db"
import crawler from "crawler-request"

import { BlitzNextApiResponse, Ctx } from "@blitzjs/next"
import { splitText } from "src/core/utils/splitText"
import { createEmbedding } from "src/core/utils/createEmbedding"

const PDF_URL =
  "https://prod-help-content.care.irobotapi.com/files/j_series/j7combo/og/j7comboplus_NA.pdf"

export default api(async (_req, res: BlitzNextApiResponse, ctx: Ctx) => {
  if (!ctx.session.userId) {
    res.status(401).json({
      message: "Unauthorized",
    })

    return
  }

  const pdfText = await crawler(PDF_URL).then(function (response) {
    return response.text
  })

  const textChunks = splitText(pdfText)

  const data = await db.data.create({
    data: {
      userId: ctx.session.userId,
      // TODO remove hardcoded botId
      botId: 1,
      type: DataType.PDF,
      url: PDF_URL,
    },
  })

  for (const chunk of textChunks) {
    const embeddingResData = await createEmbedding(chunk.content)

    if (embeddingResData) {
      const dataIndexRow = await db.dataIndex.create({
        data: {
          dataId: data.id,
          content: chunk.content,
        },
      })

      // Add the embedding
      await db.$executeRaw`
        UPDATE "DataIndex"
        SET embedding = ${embeddingResData}::vector
        WHERE id = ${dataIndexRow.id}
      `
    }
  }

  res.status(200).json({
    message: "Success",
  })
})
