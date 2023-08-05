import { BlitzPage } from "@blitzjs/next"
import Chat from "src/bots/components/Chat"
import getBot from "src/bots/queries/getBotQuery"

interface BotPageProps {
  id: number
  botName: string
  dataId: number
}

const BotPage: BlitzPage<BotPageProps> = ({ botName, dataId }) => {
  return (
    <div className="bg-slate-100 h-screen flex items-center justify-center">
      <Chat name={botName} dataId={dataId} />
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const bot = await getBot({ id: Number(params.id) })

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
    },
  }
}

export default BotPage
