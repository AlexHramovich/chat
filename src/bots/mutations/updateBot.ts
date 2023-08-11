// app/products/mutations/createProduct.tsx
import { Ctx } from "blitz"
import db, { DataType } from "db"
import * as z from "zod"
import { BotEditSchema } from "../schemas/botSchemas"
import { BOT_OWNER_ERROR } from "../constants/errors"
import parseWebsite from "./parseWebSite"
import createBotDataSource from "./createBotDataSource"
import parsePDFDocument from "./parsePDFDocument"

export default async function updateBot(input: z.infer<typeof BotEditSchema>, ctx: Ctx) {
  // Validate input - very important for security
  const data = BotEditSchema.parse(input)

  // Require user to be logged in
  ctx.session.$authorize()
  const currentBotData = await db.bot.findFirst({ where: { id: data.id } })

  if (currentBotData?.userId !== ctx.session.userId) {
    throw new Error(BOT_OWNER_ERROR)
  }

  const bot = await db.bot.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      generalContext: data.context,
      role: data.role,
    },
    include: { data: true },
  })

  if (
    bot.data[0]?.prefix !== data.dataPrefix ||
    bot.data[0]?.url !== data.dataUrl ||
    bot.data[0]?.type !== data.dataType
  ) {
    await db.data.deleteMany({
      where: {
        botId: bot.id,
      },
    })

    const botData = await createBotDataSource(
      {
        botId: bot.id,
        type: data.dataType,
        url: data.dataUrl,
        prefix: data.dataPrefix,
      },
      ctx
    )

    if (data.dataType === DataType.WEB_SITE) {
      await parseWebsite(
        {
          siteMapUrl: data.dataUrl,
          prefix: data.dataPrefix,
          dataId: botData.id,
        },
        ctx
      )
    }

    if (data.dataType === DataType.PDF) {
      await parsePDFDocument({ pdfUrl: data.dataUrl, dataId: botData.id }, ctx)
    }
  }

  return bot
}
