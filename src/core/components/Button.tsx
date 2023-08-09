import React from "react"

export enum BUTTON_APPEREANCE {
  BUTTON = "button",
  ERROR = "error",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appereance?: BUTTON_APPEREANCE
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  appereance = BUTTON_APPEREANCE.BUTTON,
  ...rest
}) => {
  if (appereance === BUTTON_APPEREANCE.ERROR) {
    return (
      <button
        className={`px-4 py-2 text-red-700 font-semibold flex items-center rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:red-teal-700 focus:ring-opacity-50 active:bg-red-900 hover:text-white ${className}`}
        onClick={onClick}
        type="button"
        {...rest}
      >
        {children}
      </button>
    )
  }
  return (
    <button
      className={`px-4 py-2 bg-teal-700 bg- text-white font-semibold flex items-center rounded-md hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-opacity-50 active:bg-teal-900 ${className}`}
      onClick={onClick}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
