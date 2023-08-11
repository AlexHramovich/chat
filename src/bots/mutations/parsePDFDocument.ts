import { Ctx } from "blitz"
import db from "db"
import * as z from "zod"
import crawler from "crawler-request"
import { splitText } from "src/core/utils/splitText"
import { createEmbedding } from "src/core/utils/createEmbedding"

const ParsePDFDocumentSchema = z.object({
  pdfUrl: z.string(),
  dataId: z.number(),
})

export default async function parsePDFDocument(
  data: z.infer<typeof ParsePDFDocumentSchema>,
  ctx: Ctx
) {
  ctx.session.$authorize()

  const dataId = data.dataId
  const pdfUrl = data.pdfUrl

  if (!pdfUrl) {
    throw new Error("No PDF url provided")
  }

  const pdfText = await crawler(pdfUrl).then(function (response) {
    return response.text
  })

  const textChunks = splitText(pdfText)

  try {
    for (const chunk of textChunks) {
      const embeddingResData = await createEmbedding(chunk.content)

      if (embeddingResData) {
        const dataIndexRow = await db.dataIndex.create({
          data: {
            dataId,
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

    return "success"
  } catch (error) {
    throw new Error(`Error parsing PDF. ${error.message}`)
  }
}
