import { BlitzPage } from "@blitzjs/next"
import BotCreationForm from "src/bots/components/BotCreationForm"
import DashboardLayout from "src/core/layouts/DashboardLayout"

const CreateBotPage: BlitzPage = () => {
  return (
    <DashboardLayout title="Create New Bot">
      <BotCreationForm />
    </DashboardLayout>
  )
}

export default CreateBotPage
