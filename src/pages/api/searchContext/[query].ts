import { api } from "src/blitz-server"
import db from "db"

import { BlitzNextApiResponse, Ctx } from "@blitzjs/next"
import { createEmbedding } from "src/core/utils/createEmbedding"

export default api(async (_req, res: BlitzNextApiResponse, ctx: Ctx) => {
  const query = _req.query.query as string
  const dataId = _req.query.data as string

  const embedding = await createEmbedding(query)

  const { find_context: context }: any = await db.$queryRawUnsafe(
    'SELECT CAST("find_context"($1::vector, $2::float, $3::integer, $4::integer) AS text)',
    embedding,
    0.7,
    4,
    dataId
  )

  res.status(200).json({
    context,
  })
})
