import { Ctx } from "@blitzjs/next"
import db from "db"
import { createEmbedding } from "src/core/utils/createEmbedding"
import * as z from "zod"

const GetContextArgs = z.object({
  searchTerm: z.string(),
  dataId: z.number(),
})

export default async function getContext(input: z.infer<typeof GetContextArgs>, ctx: Ctx) {
  // Require user to be logged in
  ctx.session.$authorize()

  const data = GetContextArgs.parse(input)

  if (!data.searchTerm) {
    return null
  }

  const embedding = await createEmbedding(data.searchTerm)

  const result: any = await db.$queryRawUnsafe(
    'SELECT CAST("find_context"($1::vector, $2::float, $3::integer, $4::integer) AS text)',
    embedding,
    0.1,
    2,
    data.dataId
  )

  return result.reduce((acc, item: any) => {
    const { find_context: resultString } = item

    return `${acc} ${resultString}`
  }, "")
}
