import React from "react"

interface PreviewLineProps {
  title: string
  content: string
}

const PreviewLine: React.FC<PreviewLineProps> = ({ title, content }) => {
  return (
    <div className="mb-4">
      <div className="font-semibold text-md">{title}</div>
      <div className="text-justify">{content}</div>
    </div>
  )
}

export default PreviewLine
