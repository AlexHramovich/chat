import { Ctx } from "@blitzjs/next"
import db from "db"
import * as z from "zod"

const GetBotArgs = z.object({
  id: z.number(),
})

export default async function getBot(input: z.infer<typeof GetBotArgs>, ctx: Ctx) {
  // Require user to be logged in
  ctx.session.$authorize()

  const data = GetBotArgs.parse(input)
  const project = await db.bot.findFirst({
    where: { id: data.id },
    select: {
      id: true,
      name: true,
      generalContext: true,
      role: true,
      data: { select: { id: true } },
    },
  })

  return project
}
