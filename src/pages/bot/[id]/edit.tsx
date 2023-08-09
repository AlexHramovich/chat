import { BlitzPage } from "@blitzjs/next"
import { Bot, Data } from "@prisma/client"
import { gSSP } from "src/blitz-server"
import BotEditForm from "src/bots/components/BotEditForm"
import getFullBot from "src/bots/queries/getFullBotQuery"
import DashboardLayout from "src/core/layouts/DashboardLayout"

interface Props {
  bot: Bot & {
    data: Data[]
  }
}

const EditBotPage: BlitzPage<Props> = ({ bot }) => {
  return (
    <DashboardLayout title="Edit Bot">
      <BotEditForm data={bot} />
    </DashboardLayout>
  )
}

export const getServerSideProps = gSSP(async ({ params, ctx }) => {
  if (!params?.id) {
    return {
      notFound: true,
    }
  }

  const bot = await getFullBot({ id: Number(params.id) }, ctx)

  if (!bot || !bot.id) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      bot,
    },
  }
})

export default EditBotPage
