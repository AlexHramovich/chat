import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getBots from "src/bots/queries/getBotsQuery"
import Link from "next/link"

const BotsTable = () => {
  const [bots, { isLoading }] = useQuery(getBots, {}, { suspense: false })

  return (
    <div className="grid grid-cols-5 gap-6">
      {isLoading && (
        <div className="col-span-5 mt-4">
          <div>Loading...</div>
        </div>
      )}

      {!isLoading && (
        <>
          {bots &&
            Boolean(bots?.length) &&
            bots.map((bot) => (
              <Link
                href={`/bot/${bot.id}`}
                key={bot.id}
                className=" p-4 min-h-[200px] rounded-md bg-teal-50 hover:bg-teal-600 hover:text-white flex items-end content-start text-xl font-semibold border-2 border-teal-600 hover:cursor-pointer"
              >
                {bot.name}
              </Link>
            ))}
          <Link
            href={`/bots/new`}
            className="relative p-4 min-h-[200px] rounded-md hover:bg-teal-600 hover:text-white flex items-center justify-center text-[130px] font-light text-teal-600 border-2 border-teal-600 hover:cursor-pointer"
          >
            <div className="absolute top-[50%] left-[50%] tansform translate-x-[-50%] translate-y-[-55%]">
              +
            </div>
          </Link>
        </>
      )}
    </div>
  )
}

export default BotsTable
