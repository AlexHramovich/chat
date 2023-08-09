import { DataType } from "@prisma/client"
import React from "react"
import { Form as FinalForm } from "react-final-form"
import { validateZodSchema } from "blitz"
import { BotCreationSchema } from "../schemas/botSchemas"
import Button from "src/core/components/Button"
import LabeledTextField from "src/core/components/LabeledTextField"
import PreviewLine from "./PreviewLine"
import LabeledSelectField from "src/core/components/LabeledSelectField"
import { useMutation } from "@blitzjs/rpc"
import createBot from "../mutations/createNewBot"
import { FORM_ERROR } from "final-form"
import { BOT_LIMIT_ERROR } from "../constants/errors"
import { useRouter } from "next/router"

const DEFAULT_CONTEXT = `You work for "FutureTech Traders". "FutureTech Traders" is a global leader in innovative technologies and advanced technical solutions. We specialize in developing and delivering cutting-edge products and services to enhance the lives of our customers and optimize business processes. Our company is founded on the principles of quality, innovation, and responsibility. Our product range includes a wide array of intelligent devices, robots, automated systems, artificial intelligence, virtual and augmented reality, as well as software solutions for various aspects of life and business. We collaborate with leading scientific and technical institutions to stay at the forefront of technological innovations. Our team of experts and engineers work on developing unique and innovative solutions that empower our clients to excel in their respective fields. With a wealth of experience in global trade and a broad network of partners, we take pride in our ability to deliver outstanding services and products to the global market. Our mission is to improve the world by implementing innovative technologies and creating favorable conditions for our clients and society as a whole. If you have any questions about our products or services, our chatbot will be happy to assist you in obtaining information, placing an order, or connecting you with our experts for more detailed consultations. Trust "FutureTech Traders" to bring your technological dreams to life!`
const DEFAULT_ROLE = `You are a helpful assistant. You are trying to help the user solve his problems and answer his questions.`

const BotCreationForm: React.FC = () => {
  const [createBotMutation, { isLoading }] = useMutation(createBot)
  const router = useRouter()

  return (
    <FinalForm
      validate={validateZodSchema(BotCreationSchema)}
      initialValues={{
        role: DEFAULT_ROLE,
        context: DEFAULT_CONTEXT,
      }}
      onSubmit={async (values) => {
        try {
          const newBot = await createBotMutation(values)
          await router.push(`/bot/${newBot.id}`)
        } catch (error: any) {
          if (error.message === BOT_LIMIT_ERROR) {
            return {
              [FORM_ERROR]:
                "You have reached the limit of bots you can create. Please upgrade your plan.",
            }
          }

          return {
            [FORM_ERROR]: error.message || "Sorry, we had an unexpected error. Please try again.",
          }
        }
      }}
      render={({ handleSubmit, submitError, values }) => (
        <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="mb-4 text-xl font-semibold">Form:</div>

            {submitError && (
              <div role="alert" style={{ color: "red" }}>
                {submitError}
              </div>
            )}
            <LabeledTextField label="Name" name="name" type="text" />
            <LabeledTextField label="Role" name="role" type="text" />
            <LabeledTextField label="Context" name="context" type="text" />
            <LabeledSelectField
              name="dataType"
              label="Data Type"
              options={[
                { label: "None", value: "" },
                { label: "PDF", value: DataType.PDF },
                { label: "Website", value: DataType.WEB_SITE },
              ]}
            />
            {values.dataType && (
              <LabeledTextField
                label={values.dataType === DataType.WEB_SITE ? "Sitemap Url" : "File Url"}
                name="dataUrl"
                type="text"
              />
            )}
            {values.dataType === DataType.WEB_SITE && (
              <LabeledTextField label="Data Prefix" name="dataPrefix" type="text" />
            )}
            <Button disabled={isLoading} type="submit" className="mt-6">
              {isLoading ? "Creation ..." : "Create"}
            </Button>
          </div>
          <div className="col-span-3">
            <div className="mb-4 text-xl font-semibold">Preview:</div>
            <PreviewLine title="Name" content={values.name || "---"} />
            <PreviewLine title="Role" content={values.role || "---"} />
            <PreviewLine title="General Context" content={values.context || "---"} />
            <PreviewLine title="Data URL" content={values.dataUrl || "---"} />
          </div>
        </form>
      )}
    />
  )
}

export default BotCreationForm
