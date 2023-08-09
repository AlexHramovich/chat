// app/products/mutations/createProduct.tsx
import { Ctx } from "blitz"
import db from "db"
import * as z from "zod"
import { BOT_OWNER_ERROR } from "../constants/errors"

const DeleteBotSchema = z.object({
  botId: z.number(),
})

export default async function deleteBot(input: z.infer<typeof DeleteBotSchema>, ctx: Ctx) {
  // Validate input - very important for security
  const data = DeleteBotSchema.parse(input)

  // Require user to be logged in
  ctx.session.$authorize()
  const bot = await db.bot.findFirst({ where: { id: data.botId } })
  const isOwner = bot?.userId === ctx.session.userId

  if (!isOwner) {
    throw new Error(BOT_OWNER_ERROR)
  }

  console.log("STARTING DELETE BOT", data.botId)

  await db.bot.delete({ where: { id: data.botId } })

  return "done!"
}
