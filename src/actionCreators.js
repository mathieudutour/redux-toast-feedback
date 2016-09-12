import { FEEDBACK_ERROR, FEEDBACK_SUCCESS, CLEAR_FEEDBACK } from './actions'

export const feedbackError = (message, delay) => {
  return {
    type: FEEDBACK_ERROR,
    payload: message,
    meta: {
      delay
    }
  }
}
export const feedbackSuccess = (message, delay) => {
  return {
    type: FEEDBACK_SUCCESS,
    payload: message,
    meta: {
      delay
    }
  }
}
export const clearFeedback = (message) => {
  return {
    type: CLEAR_FEEDBACK
  }
}
