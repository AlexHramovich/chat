import Head from "next/head"
import React from "react"
import { Header } from "../components/Header"
import Menu from "../components/Menu"

interface DashboardLayoutProps extends React.PropsWithChildren {
  title: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={title} />
      <div className="container mx-auto px-4 grid grid-cols-6 gap-10">
        <div>
          <Menu />
        </div>
        <div className="col-span-5 pt-3">{children}</div>
      </div>
    </>
  )
}

export default DashboardLayout
