import { Ctx } from "blitz"
import db, { DataType } from "db"
import * as z from "zod"

const CreateBotDataSourceProps = z.object({
  botId: z.number(),
  type: z.string(),
  url: z.string(),
})

export default async function createBotDataSource(
  input: z.infer<typeof CreateBotDataSourceProps>,
  ctx: Ctx
) {
  // Validate input - very important for security
  const data = CreateBotDataSourceProps.parse(input)

  // Require user to be logged in
  ctx.session.$authorize()

  const existingData = await db.data.findFirst({ where: { botId: data.botId } })
  if (existingData) {
    throw new Error("Data source already exists, please remove it first")
  }

  const botData = await db.data.create({
    data: {
      userId: ctx.session.userId,
      // TODO remove hardcoded botId
      botId: data.botId,
      type: data.type as DataType,
      url: data.url,
    },
  })

  // Can do any processing, fetching from other APIs, etc

  return botData
}
