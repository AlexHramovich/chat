import { DataType } from "@prisma/client"
import { z } from "zod"

const name = z
  .string()
  .max(100)
  .min(3)
  .transform((str) => str.toLowerCase().trim())

const context = z
  .string()
  .max(1500)
  .min(500)
  .transform((str) => str.toLowerCase().trim())

const role = z
  .string()
  .max(300)
  .min(50)
  .transform((str) => str.toLowerCase().trim())

const dataType = z.enum([DataType.PDF, DataType.WEB_SITE])

const dataUrl = z.string().url()

const dataPrefix = z.string().url().nullish()

export const BotCreationSchema = z.object({
  name,
  context,
  role,
  dataType,
  dataUrl,
  dataPrefix,
})

export const BotEditSchema = z.object({
  id: z.number(),
  name,
  context,
  role,
  dataType,
  dataUrl,
  dataPrefix: z.string().nullish(),
})
