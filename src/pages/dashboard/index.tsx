import { BlitzPage } from "@blitzjs/next"
import DashboardLayout from "src/core/layouts/DashboardLayout"

const DashboardPage: BlitzPage = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div>content</div>
    </DashboardLayout>
  )
}

export default DashboardPage
