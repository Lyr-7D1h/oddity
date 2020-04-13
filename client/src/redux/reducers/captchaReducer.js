import { UPDATE_CAPTCHA, FETCH_CAPTCHA } from '../actions/captchaActions'

export default (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_CAPTCHA:
      return payload.captcha
    case FETCH_CAPTCHA:
      return { isLoading: true }
    default:
      return state
  }
}
