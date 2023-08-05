import { api } from "src/blitz-server"
import db, { DataType } from "db"
import crawler from "crawler-request"

import { BlitzNextApiResponse, Ctx } from "@blitzjs/next"
import { splitText } from "src/core/utils/splitText"
import { createEmbedding } from "src/core/utils/createEmbedding"
import { NextApiRequest } from "next"
import createBotDataSource from "src/bots/mutations/createBotDataSource"

export default api(async (_req: NextApiRequest, res: BlitzNextApiResponse, ctx: Ctx) => {
  const pdfUrl = _req.query.pdfUrl as string

  if (!ctx.session.userId) {
    res.status(401).json({
      message: "Unauthorized",
    })

    return
  }

  if (!pdfUrl) {
    return res.status(400).json({
      message: "Missing PDF url",
    })
  }

  const pdfText = await crawler(pdfUrl).then(function (response) {
    return response.text
  })

  const textChunks = splitText(pdfText)

  try {
    const data = await createBotDataSource(
      {
        // TODO remove hardcoded botId
        botId: 1,
        type: DataType.PDF,
        url: pdfUrl,
      },
      ctx
    )

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
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error processing document",
    })
  }
})
