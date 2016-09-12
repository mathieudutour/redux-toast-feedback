redux-toast-feedback
=============

[![build status](https://img.shields.io/travis/mathieudutour/redux-toast-feedback/master.svg?style=flat-square)](https://travis-ci.org/mathieudutour/redux-toast-feedback)
[![npm version](https://img.shields.io/npm/v/redux-toast-feedback.svg?style=flat-square)](https://www.npmjs.com/package/redux-toast-feedback)
[![Dependency Status](https://david-dm.org/mathieudutour/redux-toast-feedback.svg)](https://david-dm.org/mathieudutour/redux-toast-feedback)
[![devDependency Status](https://david-dm.org/mathieudutour/redux-toast-feedback/dev-status.svg)](https://david-dm.org/mathieudutour/redux-toast-feedback#info=devDependencies)

Show feedback when dispatching an action.

Working nicely together with [redux-optimist-promise](https://github.com/mathieudutour/redux-optimist-promise).

```bash
npm install --save redux-toast-feedback
```

## Usage

### Step 1: combine your reducers with the `feedback` reducer

#### `reducers/index.js`

```js
import { reducer as feedback } from 'redux-toast-feedback'
import { combineReducers } from 'redux'
import todos from './todos'
import status from './status'

export default combineReducers({
  feedback,
  todos,
  status
})
```

## Step 2: Use the feedback middleware

First, import the middleware creator and include it in `applyMiddleware` when creating the Redux store. **You need to call it as a function (See later why on configuration section below):**

```js
import { middleware as feedbackMiddleware } from 'redux-toast-feedback'

const composeStoreWithMiddleware = applyMiddleware(
  feedbackMiddleware()
)(createStore)

```

### Step 3: Mark your actions where you want to show feedback with one of `feedback` meta key

```js
store.dispatch({
  type: 'ADD_TODO',
  payload: {
    text,
    promise: {url: '/api/todo', method: 'POST', data: text}
  },
  meta: {
    feedbackDirectly: 'optimistically created todo', // show the toast directly
    feedbackOnSuccess: 'server said ok', // show the toast when the promise resolves
    feedbackOnError: 'computer says no', // show the toast when the promise rejects
    feedbackClearDelay: 1500, // number of ms after which the toast is hidden
  }
})
```

### Step 4: Add a toast component to your app

If you are using react, there is already one!

```js
import Toast from 'redux-toast-feedback/build/Toast'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <MyRootComponent />
    {Toast('name of the feedback reducer')}
  </Provider>,
  rootEl
)
```

## Configuration

You can configure the default delay after which the toast is hidden.

```js
import { middleware as feedbackMiddleware } from 'redux-toast-feedback'

const composeStoreWithMiddleware = applyMiddleware(
  feedbackMiddleware({delayToClearFeedback: 1500})
)(createStore)

```

## License

  MIT
