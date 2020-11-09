import { captureException } from '@sentry/browser'
import notificationHandler from './notificationHandler'

export default (error, opts) => {
  if (!opts) opts = {}

  console.error(error)
  captureException(error)

  const message = opts.title || 'Something went wrong'
  const description = opts.description || error.message
  if (!opts.noNotify) {
    notificationHandler.error(message, description)
  }
}
