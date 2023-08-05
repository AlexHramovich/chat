import db from "db"
import * as z from "zod"

const GetBotArgs = z.object({
  id: z.number(),
})

export default async function getBot(input: z.infer<typeof GetBotArgs>) {
  const data = GetBotArgs.parse(input)
  const project = await db.bot.findFirst({
    where: { id: data.id },
    select: { id: true, name: true, data: { select: { id: true } } },
  })

  return project
}
