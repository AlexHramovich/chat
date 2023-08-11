interface IFunctionResponse {
  type: string
  message: {
    role: "function"
    name: string
    content: string
  }
}
