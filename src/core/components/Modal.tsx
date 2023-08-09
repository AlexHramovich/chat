import React from "react"
import Button, { BUTTON_APPEREANCE, ButtonProps } from "./Button"

interface ModalProps {
  question: string
  onConfirm: () => void
  buttonProps: ButtonProps
  isLoading?: boolean
}

const Modal: React.FC<ModalProps> = ({ question, onConfirm, buttonProps, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} {...buttonProps} />

      {isModalOpen && (
        <div
          id="popup-modal"
          tabIndex={-1}
          data-hidden={isModalOpen}
          className="fixed top-0 left-0 right-0 z-50 data-[hidden=false]:hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-900 bg-opacity-20"
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  {question}
                </h3>
                <div className="flex justify-between">
                  <Button
                    onClick={() => {
                      setIsModalOpen(false)
                      onConfirm()
                    }}
                    className="w-full mr-2 flex justify-center"
                    disabled={isLoading}
                  >
                    Yes
                  </Button>
                  <Button
                    appereance={BUTTON_APPEREANCE.ERROR}
                    onClick={() => setIsModalOpen(false)}
                    className="w-full ml-2 flex justify-center"
                    disabled={isLoading}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
