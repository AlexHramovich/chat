import { BlitzPage } from "@blitzjs/next"
import Chat from "src/bots/components/Chat"
import getBot from "src/bots/queries/getBotQuery"
import { gSSP } from "src/blitz-server"
import DashboardLayout from "src/core/layouts/DashboardLayout"
import Button, { BUTTON_APPEREANCE } from "src/core/components/Button"
import Modal from "src/core/components/Modal"
import { useMutation } from "@blitzjs/rpc"
import deleteBot from "src/bots/mutations/deleteBot"
import { useRouter } from "next/router"

interface BotPageProps {
  id: number
  botName: string
  dataId: number
  botContext: string
  role: string
}

const BotPage: BlitzPage<BotPageProps> = ({ botName, dataId, botContext, id, role }) => {
  const [deleteBotMutation, { isLoading: isDeleteInProgress }] = useMutation(deleteBot)
  const router = useRouter()

  return (
    <DashboardLayout title={`Bot: ${botName}`}>
      <div className="grid grid-cols-5 gap-10">
        <div className="col-span-4 flex justify-center">
          <Chat name={botName} dataId={dataId} botContext={botContext} botRole={role} />
        </div>
        <div className="col-span-1">
          <Button className="w-full flex justify-center">Edit</Button>
          <Modal
            onConfirm={async () => {
              await deleteBotMutation({ botId: id })
              await router.push("/bots")
            }}
            question="Are you sure you want to delete this bot?"
            buttonProps={{
              appereance: BUTTON_APPEREANCE.ERROR,
              className: "w-full flex justify-center my-2",
              children: "Delete",
              disabled: isDeleteInProgress,
            }}
            isLoading={isDeleteInProgress}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export const getServerSideProps = gSSP(async ({ params, ctx }) => {
  if (!params?.id) {
    return {
      notFound: true,
    }
  }

  const bot = await getBot({ id: Number(params.id) }, ctx)

  if (!bot || !bot.data[0]) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      id: bot.id,
      botName: bot.name,
      dataId: bot.data[0].id,
      botContext: bot.generalContext,
      role: bot.role,
    },
  }
})

export default BotPage
