import test from 'ava'
import {
  resolve,
  reject
} from 'redux-optimist-promise'

import { middleware, FEEDBACK_SUCCESS, FEEDBACK_ERROR, CLEAR_FEEDBACK } from '../src/' // eslint-disable-line
import { spy, useFakeTimers } from 'sinon'
import { INITIAL_STATE } from '../src/initialState'

test.beforeEach((t) => {
  t.context.next = spy()
  t.context.clock = useFakeTimers()
  t.context.state = {...INITIAL_STATE}
  t.context.dispatch = function d (action) {
    const store = { dispatch: d, getState: () => { return {feedback: t.context.state} } }
    return middleware()(store)(t.context.next)(action)
  }
  t.context.foobar = { foo: 'bar' }
})

test.afterEach((t) => {
  t.context.clock.restore()
})

test('ignores non-feedback', (t) => {
  t.context.dispatch(t.context.foobar)
  t.true(t.context.next.calledOnce)
  t.same(t.context.next.firstCall.args[0], t.context.foobar)
})

test('dispatches FEEDBACK_SUCCESS action when direct feedback', (t) => {
  const action = {
    type: 'ACTION_TYPE',
    payload: t.context.foobar,
    meta: {
      feedbackDirectly: 'feedback'
    }
  }
  t.context.dispatch(action)

  t.true(t.context.next.calledTwice)

  t.same(t.context.next.firstCall.args[0], action)

  t.same(t.context.next.secondCall.args[0], {
    type: FEEDBACK_SUCCESS,
    payload: 'feedback',
    meta: {
      delay: undefined,
      origin: action
    }
  })

  t.context.clock.tick(1500)

  t.true(t.context.next.calledThrice)

  t.same(t.context.next.thirdCall.args[0], {
    type: CLEAR_FEEDBACK,
    meta: {
      origin: {
        type: FEEDBACK_SUCCESS,
        payload: 'feedback',
        meta: {
          delay: undefined,
          origin: action
        }
      }
    }
  })
})

test('dispatches FEEDBACK_SUCCESS action when success feedback and resolved action', (t) => {
  const action = {
    type: resolve('ACTION_TYPE'),
    payload: t.context.foobar,
    meta: {
      feedbackOnSuccess: 'feedback'
    }
  }
  t.context.dispatch(action)

  t.true(t.context.next.calledTwice)

  t.same(t.context.next.firstCall.args[0], action)

  t.same(t.context.next.secondCall.args[0], {
    type: FEEDBACK_SUCCESS,
    payload: 'feedback',
    meta: {
      delay: undefined,
      origin: action
    }
  })

  t.context.clock.tick(1500)

  t.true(t.context.next.calledThrice)

  t.same(t.context.next.thirdCall.args[0], {
    type: CLEAR_FEEDBACK,
    meta: {
      origin: {
        type: FEEDBACK_SUCCESS,
        payload: 'feedback',
        meta: {
          delay: undefined,
          origin: action
        }
      }
    }
  })
})

test('dispatches FEEDBACK_ERROR action when error feedback and rejected action', (t) => {
  const action = {
    type: reject('ACTION_TYPE'),
    payload: new Error('feedback'),
    meta: {
      feedbackOnError: true
    }
  }
  t.context.dispatch(action)

  t.true(t.context.next.calledTwice)

  t.same(t.context.next.firstCall.args[0], action)

  t.same(t.context.next.secondCall.args[0], {
    type: FEEDBACK_ERROR,
    payload: 'feedback',
    meta: {
      delay: undefined,
      origin: action
    }
  })

  t.context.clock.tick(1500)

  t.true(t.context.next.calledThrice)

  t.same(t.context.next.thirdCall.args[0], {
    type: CLEAR_FEEDBACK,
    meta: {
      origin: {
        type: FEEDBACK_ERROR,
        payload: 'feedback',
        meta: {
          delay: undefined,
          origin: action
        }
      }
    }
  })
})

test('dispatches FEEDBACK_SUCCESS action when direct feedback and custom delay', (t) => {
  const action = {
    type: 'ACTION_TYPE',
    payload: t.context.foobar,
    meta: {
      feedbackDirectly: 'feedback',
      feedbackClearDelay: 3000
    }
  }
  t.context.dispatch(action)

  t.true(t.context.next.calledTwice)

  t.same(t.context.next.firstCall.args[0], action)

  const feedbackAction = {
    type: FEEDBACK_SUCCESS,
    payload: 'feedback',
    meta: {
      delay: 3000,
      origin: action
    }
  }

  t.same(t.context.next.secondCall.args[0], feedbackAction)

  t.context.clock.tick(1500)

  t.true(t.context.next.calledTwice)

  t.context.clock.tick(1500)

  t.true(t.context.next.calledThrice)

  t.same(t.context.next.thirdCall.args[0], {
    type: CLEAR_FEEDBACK,
    meta: {
      origin: feedbackAction
    }
  })
})
