import { BlitzPage } from "@blitzjs/next"
import BotsTable from "src/bots/components/BotsTable"
import DashboardLayout from "src/core/layouts/DashboardLayout"

const BotsPage: BlitzPage = () => {
  return (
    <DashboardLayout title="Bots">
      <BotsTable />
    </DashboardLayout>
  )
}

export default BotsPage
