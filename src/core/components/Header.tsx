import React from "react"

interface HeaderProps {
  title: string
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header>
      <div className="container mx-auto px-4 py-10 mb-4 grid grid-cols-6 gap-10">
        <div className="font-extrabold text-2xl flex items-end px-4">CHAT</div>
        <div className="col-span-5 text-2xl flex items-end font-semibold">{title}</div>
      </div>
    </header>
  )
}
