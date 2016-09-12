import * as actions from './actions'
import * as actionCreators from './actionCreators'
import middleware from './middleware'
import reducer from './reducer'

module.exports = {
  ...actions,
  ...actionCreators,
  middleware,
  reducer
}
