export default (string) => {
  const date = new Date(string)
  const today = new Date()
  if (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    if (date.getDate() === today.getDate()) {
      return `Today at ${date.toLocaleTimeString()}`
    } else if (date.getDate() === today.getDate() - 1) {
      return `Yesterday at ${date.toLocaleTimeString()}`
    }
  }
  return `${date.getDate()} at ${date.toLocaleTimeString()}`
}
