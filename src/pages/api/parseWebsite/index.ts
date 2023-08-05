import { api } from "src/blitz-server"

import crawler from "crawler-request"
import chunk from "lodash.chunk"

import { BlitzNextApiResponse, Ctx } from "@blitzjs/next"
import Sitemapper from "sitemapper"
import { splitText } from "src/core/utils/splitText"
import { createEmbedding } from "src/core/utils/createEmbedding"
import db, { DataType } from "db"
import createBotDataSource from "src/bots/mutations/createBotDataSource"

export default api(async (_req, res: BlitzNextApiResponse, ctx: Ctx) => {
  if (!ctx.session.userId) {
    res.status(401).json({
      message: "Unauthorized",
    })

    return
  }

  const siteMapUrl = _req.query.siteMapUrl as string

  if (!siteMapUrl) {
    return res.status(400).json({
      message: "Missing sitemap url",
    })
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

    const prefix = _req.query.prefix as string
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
      return res.status(400).json({
        message: "No pages that meet the prefix criteria were found",
      })
    }

    const textContent = processedPagesData.reduce((acc, pageData) => `${acc}. ${pageData.text}`, "")
    const textChunks = splitText(textContent)

    try {
      const data = await createBotDataSource(
        {
          // TODO remove hardcoded botId
          botId: 1,
          type: DataType.PDF,
          url: siteMapUrl,
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
        message: error.message || "Error processing sitemap",
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Error processing sitemap",
    })
  }
})
