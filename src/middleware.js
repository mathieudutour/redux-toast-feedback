import {
  isRejectedAction,
  isResolvedAction,
  isThenAction
} from 'redux-optimist-promise'

import {
  FEEDBACK_SUCCESS,
  FEEDBACK_ERROR
} from './actions'

import {
  feedbackError,
  feedbackSuccess,
  clearFeedback
} from './actionCreators'

import origin from './originUtil'

export default function middleware ({
  delayToClearFeedback = 1500
} = {}) {
  return ({dispatch}) => (next) => (action) => {
    const result = next(action)

    if (!action || !action.type) { return result }

    if (!isThenAction(action.type) &&
      action.meta && action.meta.feedbackDirectly && !action.meta.skipOptimist) {
      dispatch(origin(
        feedbackSuccess(action.meta.feedbackDirectly, action.meta.feedbackClearDelay), action)
      )
    } else if (isResolvedAction(action.type) &&
      action.meta && action.meta.feedbackOnSuccess) {
      dispatch(origin(
        feedbackSuccess(action.meta.feedbackOnSuccess, action.meta.feedbackClearDelay), action)
      )
    } else if (isRejectedAction(action.type) &&
      action.meta && action.meta.feedbackOnError) {
      let payload
      if (action.meta.feedbackOnError === true) {
        /* handle all the weird cases */
        if (action.payload.response) {
          if (typeof action.payload.response.data.message === 'object') {
            payload = action.payload.response.data.message.message
          } else {
            payload = action.payload.response.data.message
          }
        } else if (action.payload.message) {
          payload = action.payload.message
        } else if (typeof action.payload.data.message === 'object') {
          payload = action.payload.data.message.message
        } else {
          payload = action.payload.data.message
        }
      } else {
        payload = action.meta.feedbackOnError
      }
      dispatch(origin(
        feedbackError(payload, action.meta.feedbackClearDelay), action)
      )
    }

    if (action.type === FEEDBACK_ERROR || action.type === FEEDBACK_SUCCESS) {
      setTimeout(() =>
        dispatch(origin(clearFeedback(), action))
      , (action.meta || {}).delay || delayToClearFeedback)
    }

    return result
  }
}
