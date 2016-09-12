import { INITIAL_STATE } from './initialState'
import { FEEDBACK_ERROR, FEEDBACK_SUCCESS, CLEAR_FEEDBACK } from './actions'

export default function reducer (state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case FEEDBACK_ERROR:
      return {...state, error: action.payload}
    case FEEDBACK_SUCCESS:
      return {...state, success: action.payload}
    case CLEAR_FEEDBACK:
      return INITIAL_STATE
    default: return state
  }
}
