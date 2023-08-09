import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

const MENU_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Bots",
    href: "/bots",
  },
]

const Menu: React.FC = () => {
  const router = useRouter()

  return (
    <div>
      {MENU_ITEMS.map((item) => {
        const isActive = router.pathname.startsWith(item.href)

        return (
          <Link
            href={item.href}
            data-active={isActive}
            key={item.title}
            className="px-4 w-full block py-3 data-[active=true]:text-teal-700 data-[active=true]:bg-teal-50 data-[isActive=true]:font-semibold rounded-md mb-4 no-underline hover:underline hover:text-teal-700"
          >
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}

export default Menu
