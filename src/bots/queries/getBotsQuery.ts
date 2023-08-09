import { Ctx } from "@blitzjs/next"
import db from "db"
import * as z from "zod"

const GetBotsArgs = z.object({})

export default async function getBots(input: z.infer<typeof GetBotsArgs>, ctx: Ctx) {
  // Require user to be logged in
  ctx.session.$authorize()

  const bots = await db.bot.findMany({
    where: { userId: ctx.session.userId },
    select: { id: true, name: true },
  })

  return bots
}
