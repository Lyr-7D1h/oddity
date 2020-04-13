export const UPDATE_CAPTCHA = 'captcha:updateCaptcha'
export const FETCH_CAPTCHA = 'captcha:fetchCaptcha'

export const updateCaptcha = (captcha) => {
  return {
    type: UPDATE_CAPTCHA,
    payload: {
      captcha: captcha,
    },
  }
}
export const fetchCaptcha = () => {
  return {
    type: FETCH_CAPTCHA,
  }
}
