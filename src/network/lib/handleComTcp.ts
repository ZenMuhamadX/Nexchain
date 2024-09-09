export const processMessage = (message: string): string => {
  if(message === 'ping') {
    return 'pong'
  } else if(message === 'pong') {
    return 'ping'
  }
  return message
}
