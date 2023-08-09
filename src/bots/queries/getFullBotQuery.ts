import { Ctx } from "@blitzjs/next"
import db from "db"
import * as z from "zod"

const GetFullBotArgs = z.object({
  id: z.number(),
})

export default async function getFullBot(input: z.infer<typeof GetFullBotArgs>, ctx: Ctx) {
  // Require user to be logged in
  ctx.session.$authorize()

  const data = GetFullBotArgs.parse(input)
  const project = await db.bot.findFirst({
    where: { id: data.id, userId: ctx.session.userId },
    include: {
      data: true,
    },
  })

  return project
}
