interface errorInfo {
  error: string | any,
  time: string
  hint?: string
  warning?: any
}

export const loggingErr = (err: errorInfo): void => {
  if (err) {
    console.error({
      error: err.error,
      time: err.time,
      hint: err.hint,
      warning: err.warning,
    })
    throw new Error().stack
  }
  return
}
