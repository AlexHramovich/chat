// app/products/mutations/createProduct.tsx
import { Ctx } from "blitz"
import db, { DataType } from "db"
import * as z from "zod"
import { BotCreationSchema } from "../schemas/creatinFormSchema"
import { BOT_LIMIT_ERROR } from "../constants/errors"
import createBotDataSource from "./createBotDataSource"
import parseWebsite from "./parseWebSite"

export default async function createBot(input: z.infer<typeof BotCreationSchema>, ctx: Ctx) {
  // Validate input - very important for security
  const data = BotCreationSchema.parse(input)

  // Require user to be logged in
  ctx.session.$authorize()
  const isUserAlreadyHasBot = await db.bot.findFirst({ where: { userId: ctx.session.userId } })

  if (isUserAlreadyHasBot) {
    throw new Error(BOT_LIMIT_ERROR)
  }

  const bot = await db.bot.create({
    data: {
      name: data.name,
      userId: ctx.session.userId,
      generalContext: data.context,
      role: data.role,
    },
  })

  const botData = await createBotDataSource(
    {
      botId: bot.id,
      type: data.dataType,
      url: data.dataUrl,
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

  return bot
}
