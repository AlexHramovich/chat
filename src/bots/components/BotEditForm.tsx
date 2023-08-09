import { Bot, Data, DataType } from "@prisma/client"
import React from "react"
import { Form as FinalForm } from "react-final-form"
import { validateZodSchema } from "blitz"
import { BotEditSchema } from "../schemas/botSchemas"
import LabeledTextField from "src/core/components/LabeledTextField"
import PreviewLine from "./PreviewLine"
import LabeledSelectField from "src/core/components/LabeledSelectField"
import { FORM_ERROR } from "final-form"
import Modal from "src/core/components/Modal"
import updateBot from "../mutations/updateBot"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"

interface BotEditFormProps {
  data: Bot & {
    data: Data[]
  }
}

const BotEditForm: React.FC<BotEditFormProps> = ({ data }) => {
  console.log("data", data)

  const [updateBotMutation, { isLoading }] = useMutation(updateBot)
  const router = useRouter()

  const botFormId = `edit-bot-form-${data.id}`

  return (
    <FinalForm
      validate={validateZodSchema(BotEditSchema)}
      initialValues={{
        id: data.id,
        role: data.role,
        context: data.generalContext,
        name: data.name,
        dataType: data.data[0]?.type,
        dataUrl: data.data[0]?.url,
        dataPrefix: data.data[0]?.prefix || "",
      }}
      onSubmit={async (values) => {
        try {
          await updateBotMutation({ ...values, id: data.id })
          await router.push(`/bot/${data.id}`)
        } catch (error: any) {
          return {
            [FORM_ERROR]: error.message || "Sorry, we had an unexpected error. Please try again.",
          }
        }
      }}
      render={({ handleSubmit, submitError, values }) => (
        <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-10" id={botFormId}>
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
            <Modal
              question="Are you sure you want to edit this bot?"
              buttonProps={{
                children: isLoading ? "Editing ..." : "Edit",
                disabled: isLoading,
                className: "mt-6",
                type: "button",
              }}
              onConfirm={() => {
                document
                  ?.getElementById(botFormId)
                  ?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })) // ✅
              }}
              isLoading={isLoading}
            />
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

export default BotEditForm
