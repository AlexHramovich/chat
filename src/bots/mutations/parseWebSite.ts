// app/products/mutations/createProduct.tsx
import { Ctx } from "blitz"
import db, { DataType } from "db"
import * as z from "zod"
import Sitemapper from "sitemapper"
import chunk from "lodash.chunk"
import crawler from "crawler-request"
import { splitText } from "src/core/utils/splitText"
import { createEmbedding } from "src/core/utils/createEmbedding"

const ParseWebsiteSchema = z.object({
  siteMapUrl: z.string(),
  prefix: z.string().nullish(),
  dataId: z.number(),
})

export default async function parseWebsite(data: z.infer<typeof ParseWebsiteSchema>, ctx: Ctx) {
  ctx.session.$authorize()

  const siteMapUrl = data.siteMapUrl
  const dataId = data.dataId

  if (!siteMapUrl) {
    throw new Error("No sitemap url provided")
  }

  const sitemapper = new Sitemapper({
    url: siteMapUrl,
    rejectUnauthorized: true,
    timeout: 15000,
    requestHeaders: {
      "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0",
    },
  })

  try {
    const sitemap = await sitemapper.fetch()

    const prefix = data.prefix
    const neededPages = prefix
      ? sitemap.sites.filter((site) => {
          return site.startsWith(prefix)
        })
      : sitemap.sites

    const pagesChunks = chunk(neededPages, 10)
    const processedPagesData: { page: string; text: string }[] = []

    for (const pagesChunk of pagesChunks) {
      const parsedPagesData = await Promise.all(
        pagesChunk.map((page) =>
          crawler(page).then((res) => {
            return { page, text: res.text }
          })
        )
      )

      processedPagesData.push(...parsedPagesData)
    }

    if (!neededPages.length) {
      throw new Error("No pages that meet the prefix criteria were found")
    }

    const textContent = processedPagesData.reduce((acc, pageData) => `${acc}. ${pageData.text}`, "")
    const textChunks = splitText(textContent)

    try {
      for (const chunk of textChunks) {
        const embeddingResData = await createEmbedding(chunk.content)

        if (embeddingResData) {
          const dataIndexRow = await db.dataIndex.create({
            data: {
              dataId: dataId,
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
      throw new Error(`Error creating bot data source. ${error.message}`)
    }
  } catch (error) {
    throw new Error(`Error fetching sitemap. ${error.message}`)
  }
}
